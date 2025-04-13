import axios from 'axios';

// Define the base URL (this can be changed based on the environment)
const API_URL = 'https://your-api-url.com';  // Change this to your actual API URL

// Axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
