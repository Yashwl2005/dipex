import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Using local IP address for physical device testing
const BASE_URL = 'http://192.168.31.124:5000/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // Increased timeout to 60s for video uploads
    transformRequest: [function (data, headers) {
        // Handle React Native FormData
        if (data && data._parts) {
            if (headers) {
                delete headers['Content-Type'];
            }
            return data;
        }
        // Handle standard FormData
        if (typeof FormData !== 'undefined' && data instanceof FormData) {
            if (headers) {
                delete headers['Content-Type'];
            }
            return data;
        }
        return JSON.stringify(data);
    }],
});

// Request Interceptor
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            // Explicitly handle Content-Type for FormData
            if (config.data && config.data._parts) {
                config.headers['Content-Type'] = 'multipart/form-data';
            }
        } catch (e) {
            console.warn('Error reading token', e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        // Handle global errors like 401 Unauthorized
        if (error.response?.status === 401) {
            // Logic for logout or refresh token
        }
        return Promise.reject(error);
    }
);

export default apiClient;
