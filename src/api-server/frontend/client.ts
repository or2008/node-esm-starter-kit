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

type PostImageEnhancePromptBatchInput = {
    prompts: {
        positivePrompt: string;
        negativePrompt?: string | undefined;
        stabilityAiTextToImageParams?: any;
    }[];
};

type PostImageEnhancePromptBatchResponse = {
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

export type Path = "/docs/open-api" | "/image/hello" | "/image/enhance-prompt-batch" | "/image/view" | "/image/prompt";

export type Method = "get" | "post" | "put" | "delete" | "patch";

export type MethodPath = `${Method} ${Path}`;

export interface Input extends Record<MethodPath, any> {
    "get /docs/open-api": GetDocsOpenApiInput;
    "get /image/hello": GetImageHelloInput;
    "post /image/enhance-prompt-batch": PostImageEnhancePromptBatchInput;
    "get /image/view": GetImageViewInput;
    "post /image/prompt": PostImagePromptInput;
}

export interface Response extends Record<MethodPath, any> {
    "get /docs/open-api": GetDocsOpenApiResponse;
    "get /image/hello": GetImageHelloResponse;
    "post /image/enhance-prompt-batch": PostImageEnhancePromptBatchResponse;
    "get /image/view": GetImageViewResponse;
    "post /image/prompt": PostImagePromptResponse;
}

export const jsonEndpoints = { "get /docs/open-api": true, "get /image/hello": true, "post /image/enhance-prompt-batch": true, "post /image/prompt": true };

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