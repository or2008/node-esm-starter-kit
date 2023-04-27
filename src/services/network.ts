
import axios, { type AxiosHeaders, type AxiosRequestConfig } from 'axios';

export async function get<T>(url: string, queryParams = {}, headers = {} as AxiosHeaders) {
    const config: AxiosRequestConfig = {
        params: queryParams,
        headers
    };

    const res = await axios.get<T>(url, config);
    return res.data;
}

export async function post<T>(url: string, data = {}, headers = {}) {
    fetch('http://127.0.0.1:8188/prompt', {
        'headers': {
            'accept': '*/*',
            'accept-language': 'en,en-US;q=0.9,he;q=0.8,de;q=0.7,ru;q=0.6,zh-CN;q=0.5,zh;q=0.4,pt;q=0.3,fr;q=0.2',
            'content-type': 'application/json',
            ...headers
        },

        'body': data,
        'method': 'POST'
    });


}

// export async function post(path = '/', body = {}, headers = {}, useConfigBase = true): Promise<{ data: any; headers: any }> {
//     const config = {
//         headers: {
//             'X-Context-ID': getContextId(),
//             ...headers
//         }
//     };
//     try {
//         const res = await axios.post(getBaseUrl(useConfigBase) + path, body, config);
//         const result = res.data;

//         if (result.status === 'error')
//             throw new Error(result.message);

//         return { data: result, headers: res.headers };
//     }
//     catch (error: any) {
//         const message = error.response && error.response.data.message ? error.response.data.message : error.message;
//         throw new Error(message);
//     }
// }

// export async function put(path = '/', body = {}): Promise<{ data: any; headers: any }> {
//     const config = {
//         headers: {
//             'X-Context-ID': getContextId()
//         }
//     };

//     return axios.put(getBaseUrl() + path, body, config)
//         .then(result => {
//             const res = result.data;
//             if (res.errorCode)
//                 throw new Error(res.errorCode);

//             return { data: res.data, headers: result.headers };
//         });
// }
