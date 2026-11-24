import axios from 'axios';
import { prepareResponseObject, prepareErrorResponse } from './response';

// Base Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request Interceptor (Auth token lagane ke liye agar kabhi zaroorat ho)
axiosInstance.interceptors.request.use(
    (config) => {
        // Agar authentication add karni ho:
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Generic HTTP Methods wrapper
const HttpService = {
    async get(url, params = {}, config = {}) {
        try {
            const response = await axiosInstance.get(url, { params, ...config });
            return prepareResponseObject(response);
        } catch (error) {
            return prepareErrorResponse(error);
        }
    },

    async post(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.post(url, data, config);
            return prepareResponseObject(response);
        } catch (error) {
            return prepareErrorResponse(error);
        }
    },

    async put(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.put(url, data, config);
            return prepareResponseObject(response);
        } catch (error) {
            return prepareErrorResponse(error);
        }
    },

    async patch(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.patch(url, data, config);
            return prepareResponseObject(response);
        } catch (error) {
            return prepareErrorResponse(error);
        }
    },

    async delete(url, config = {}) {
        try {
            const response = await axiosInstance.delete(url, config);
            return prepareResponseObject(response);
        } catch (error) {
            return prepareErrorResponse(error);
        }
    },
};

export default HttpService;