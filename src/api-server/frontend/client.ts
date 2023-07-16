type GetDocsOpenApiInput = {};

type GetDocsOpenApiResponse = any | string;

type GetImageHelloInput = {
    name?: string | undefined;
};

type GetImageHelloResponse = {
    status: "success";
    data: {
        greetings: string;
        createdAt: string;
    };
} | {
    status: "error";
    error: {
        message: string;
    };
};

type PostImageEnhanceText2ImgBatchInput = {
    prompts: {
        engineId: string;
        positivePrompt: string;
        negativePrompt?: string | undefined;
        stabilityAiTextToImageParams?: any;
    }[];
};

type PostImageEnhanceText2ImgBatchResponse = {
    status: "success";
    data: {
        id: string;
    };
} | {
    status: "error";
    error: {
        message: string;
    };
};

type PostImageEnhanceImg2ImgBatchInput = {
    prompts: {
        engineId: string;
        initImage: string;
        positivePrompt: string;
        negativePrompt?: string | undefined;
        stabilityAiTextToImageParams?: any;
    }[];
};

type PostImageEnhanceImg2ImgBatchResponse = {
    status: "success";
    data: {
        id: string;
    };
} | {
    status: "error";
    error: {
        message: string;
    };
};

type GetImageViewInput = {
    filename: string;
    size?: ("xs" | "s" | "m" | "l" | "xl" | "xxl") | undefined;
};

type GetImageViewResponse = string | string;

type PostImagePromptInput = {
    prompt: string;
};

type PostImagePromptResponse = {
    status: "success";
    data: {};
} | {
    status: "error";
    error: {
        message: string;
    };
};

type GetVoiceHelloInput = {
    name?: string | undefined;
};

type GetVoiceHelloResponse = {
    status: "success";
    data: {
        greetings: string;
        createdAt: string;
    };
} | {
    status: "error";
    error: {
        message: string;
    };
};

type PostVoiceEnhanceText2SpeechBatchInput = {
    prompts: {
        voiceId: string;
        text: string;
        elevenlabsTextToSpeechParams?: any;
    }[];
};

type PostVoiceEnhanceText2SpeechBatchResponse = {
    status: "success";
    data: {
        id: string;
    };
} | {
    status: "error";
    error: {
        message: string;
    };
};

type PostVoiceElevenlabsProxyInput = {
    method: "GET" | "POST" | "DELETE" | "PUT";
    path: string;
    payload?: any;
    headers?: any;
};

type PostVoiceElevenlabsProxyResponse = {
    status: "success";
    data?: any;
} | {
    status: "error";
    error: {
        message: string;
    };
};

export type Path = "/docs/open-api" | "/image/hello" | "/image/enhance-text-2-img-batch" | "/image/enhance-img-2-img-batch" | "/image/view" | "/image/prompt" | "/voice/hello" | "/voice/enhance-text-2-speech-batch" | "/voice/elevenlabs-proxy";

export type Method = "get" | "post" | "put" | "delete" | "patch";

export type MethodPath = `${Method} ${Path}`;

export interface Input extends Record<MethodPath, any> {
    "get /docs/open-api": GetDocsOpenApiInput;
    "get /image/hello": GetImageHelloInput;
    "post /image/enhance-text-2-img-batch": PostImageEnhanceText2ImgBatchInput;
    "post /image/enhance-img-2-img-batch": PostImageEnhanceImg2ImgBatchInput;
    "get /image/view": GetImageViewInput;
    "post /image/prompt": PostImagePromptInput;
    "get /voice/hello": GetVoiceHelloInput;
    "post /voice/enhance-text-2-speech-batch": PostVoiceEnhanceText2SpeechBatchInput;
    "post /voice/elevenlabs-proxy": PostVoiceElevenlabsProxyInput;
}

export interface Response extends Record<MethodPath, any> {
    "get /docs/open-api": GetDocsOpenApiResponse;
    "get /image/hello": GetImageHelloResponse;
    "post /image/enhance-text-2-img-batch": PostImageEnhanceText2ImgBatchResponse;
    "post /image/enhance-img-2-img-batch": PostImageEnhanceImg2ImgBatchResponse;
    "get /image/view": GetImageViewResponse;
    "post /image/prompt": PostImagePromptResponse;
    "get /voice/hello": GetVoiceHelloResponse;
    "post /voice/enhance-text-2-speech-batch": PostVoiceEnhanceText2SpeechBatchResponse;
    "post /voice/elevenlabs-proxy": PostVoiceElevenlabsProxyResponse;
}

export const jsonEndpoints = { "get /docs/open-api": true, "get /image/hello": true, "post /image/enhance-text-2-img-batch": true, "post /image/enhance-img-2-img-batch": true, "post /image/prompt": true, "get /voice/hello": true, "post /voice/enhance-text-2-speech-batch": true, "post /voice/elevenlabs-proxy": true };

export type Provider = <M extends Method, P extends Path>(method: M, path: P, params: Input[`${M} ${P}`]) => Promise<Response[`${M} ${P}`]>;

export type Implementation = (method: Method, path: string, params: Record<string, any>) => Promise<any>;

/*
export const exampleImplementation: Implementation = async (
  method,
  path,
  params
) => {
  const hasBody = !["get", "delete"].includes(method);
  const searchParams = hasBody ? "" : `?${new URLSearchParams(params)}`;
  const response = await fetch(`https://example.com${path}${searchParams}`, {
    method: method.toUpperCase(),
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(params) : undefined,
  });
  if (`${method} ${path}` in jsonEndpoints) {
    return response.json();
  }
  return response.text();
};

const client = new ExpressZodAPIClient(exampleImplementation);
client.provide("get", "/v1/user/retrieve", { id: "10" });
*/
export class ExpressZodAPIClient {
    constructor(protected readonly implementation: Implementation) { }
    public readonly provide: Provider = (method, path, params) => this.implementation(method, Object.keys(params).reduce((acc, key) => acc.replace(`:${key}`, params[key]), path), Object.keys(params).reduce((acc, key) => path.indexOf(`:${key}`) >= 0 ? acc : { ...acc, [key]: params[key] }, {}));
}