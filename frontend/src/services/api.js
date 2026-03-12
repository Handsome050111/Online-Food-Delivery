import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // This logic maps to the vite proxy we configured!
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedInfo = JSON.parse(userInfo);
            if (parsedInfo && parsedInfo.token) {
                config.headers.Authorization = `Bearer ${parsedInfo.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
