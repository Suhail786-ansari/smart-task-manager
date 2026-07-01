import axios from 'axios';

const API = axios.create({
    baseURL: 'https://smart-task-manager-u1pv.onrender.com'
});

// Request bhejte waqt automatic token attach karne ka tarika (Interceptors)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;