import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Adiciona o cabeçalho Authorization no formato esperado pelo backend
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Axios Interceptor - Token enviado:', token); // Debugging do Interceptor
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;