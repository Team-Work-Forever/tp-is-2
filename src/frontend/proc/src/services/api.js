import axios from "axios";

const apiProc = axios.create({
    withCredentials: false,
    baseURL: 'http://localhost:7321',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 20000
});

export default apiProc;