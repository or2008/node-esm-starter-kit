
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
    // console.log(`POST ${url}`, {data, headers});

    return fetch(url, {
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
