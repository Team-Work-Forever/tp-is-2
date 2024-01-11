import axios from "axios";
console.log(process.env.API_ENTITIES_URL);

const api = axios.create({
    // withCredentials: false,
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;