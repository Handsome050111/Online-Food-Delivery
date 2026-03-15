import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // This logic maps to the vite proxy we configured!
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        // STEP 1 - JSON REQUEST BODY VALIDATION
        // Ensure POST/PUT requests always have a body to prevent backend parser crashes
        if ((config.method === 'post' || config.method === 'put') && !config.data) {
            config.data = {};
        }

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
