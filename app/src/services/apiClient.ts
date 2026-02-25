import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Removed localtunnel, using local IP for reliable connection.
const BASE_URL = 'http://192.168.31.124:5000/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
    },
    timeout: 60000, // Increased timeout to 60s for video uploads
});

// Request Interceptor
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            // Do not explicitly set Content-Type for FormData,
            // let Axios/React Native generate the boundary string
            if (config.data && config.data._parts) {
                delete config.headers['Content-Type'];
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
