interface GetImageHelloInput {
    name?: string | undefined;
}

type GetImageHelloResponse = {
    status: 'error';
    error: {
        message: string;
    };
} | {
    status: 'success';
    data: {
        greetings: string;
        createdAt: string;
    };
};

interface GetImageViewInput {
    filename: string;
    size?: ('l' | 'm' | 's' | 'xl' | 'xs' | 'xxl') | undefined;
}

type GetImageViewResponse = string  ;

type PostImagePromptInput = {
    key: string;
} & {
    prompt: string;
};

type PostImagePromptResponse = {
    status: 'error';
    error: {
        message: string;
    };
} | {
    status: 'success';
    data: {
        prompt: string;
    };
};

export type Path = '/image/hello' | '/image/prompt' | '/image/view';

export type Method = 'delete' | 'get' | 'patch' | 'post' | 'put';

export type MethodPath = `${Method} ${Path}`;

export interface Input extends Record<MethodPath, any> {
    'get /image/hello': GetImageHelloInput;
    'get /image/view': GetImageViewInput;
    'post /image/prompt': PostImagePromptInput;
}

export interface Response extends Record<MethodPath, any> {
    'get /image/hello': GetImageHelloResponse;
    'get /image/view': GetImageViewResponse;
    'post /image/prompt': PostImagePromptResponse;
}

export const jsonEndpoints = { 'get /image/hello': true, 'post /image/prompt': true };

export type Provider = <M extends Method, P extends Path>(method: M,path: P,params: Input[`${M} ${P}`]) => Promise<Response[`${M} ${P}`]>;

export type Implementation = (method: Method,path: string,params: Record<string, any>) => Promise<any>;

// 
// export const exampleImplementation: Implementation = async (
// method,
// path,
// params
// ) => {
// const hasBody = !["get", "delete"].includes(method);
// const searchParams = hasBody ? "" : `?${new URLSearchParams(params)}`;
// const response = await fetch(`https://example.com${path}${searchParams}`, {
//     method: method.toUpperCase(),
//     headers: hasBody ? { "Content-Type": "application/json" } : undefined,
//     body: hasBody ? JSON.stringify(params) : undefined,
// });
// if (`${method} ${path}` in jsonEndpoints) {
//     return response.json();
// }
// return response.text();
// };
// 
// const client = new ExpressZodAPIClient(exampleImplementation);
// client.provide("get", "/v1/user/retrieve", { id: "10" });
// 
export class ExpressZodAPIClient {
    public readonly provide: Provider = async (method, path, params) => this.implementation(method, Object.keys(params).reduce((acc, key) => acc.replace(`:${key}`, params[key]), path), Object.keys(params).reduce((acc, key) => path.includes(`:${key}`) ? acc : { ...acc, [key]: params[key] }, {}));

    constructor(protected readonly implementation: Implementation) { }
    
}