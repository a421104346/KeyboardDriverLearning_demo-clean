import { AxiosRequestConfig } from 'axios';
export declare const request: {
    get: (baseURL: string, url: string, params?: any, config?: AxiosRequestConfig) => any;
    post: (baseURL: string, url: string, data?: any, config?: AxiosRequestConfig) => any;
    upload: (baseURL: string, url: string, formData: FormData, config?: AxiosRequestConfig) => any;
    getFile: (baseURL: string, url: string, params?: any, config?: AxiosRequestConfig) => any;
};
