import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Ajuste se necessário

const api = axios.create({
    baseURL: API_URL,
});

// Adiciona o token JWT automaticamente, se estiver logado
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
