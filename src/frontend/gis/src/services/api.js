import axios from "axios";

const apiGis = axios.create({
    withCredentials: false,
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiGis;