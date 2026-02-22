import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local machine's IP address (ipconfig/ifconfig) if testing on physical device
// Using Localtunnel proxy to bypass Windows Firewall Port 5000 restrictions on physical Wi-Fi
const BASE_URL = 'https://little-suits-take.loca.lt/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
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
