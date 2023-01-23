
import axios, { type AxiosHeaders, type AxiosRequestConfig } from 'axios';

export async function get<T>(url: string, queryParams = {} as Record<string, unknown>, headers = {} as AxiosHeaders) {
    const config: AxiosRequestConfig = {
        params: queryParams,
        headers
    };

    const res = await axios.get<T>(url, config);
    return res.data;
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
