import axios from "axios";

const apiGraphQl = axios.create({
    withCredentials: false,
    baseURL: 'http://localhost:7322',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 20000
});

export default apiGraphQl;