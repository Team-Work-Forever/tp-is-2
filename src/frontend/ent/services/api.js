import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REACT_APP_API_ENTITIES_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;