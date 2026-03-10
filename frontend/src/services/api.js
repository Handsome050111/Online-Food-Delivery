import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // This logic maps to the vite proxy we configured!
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
