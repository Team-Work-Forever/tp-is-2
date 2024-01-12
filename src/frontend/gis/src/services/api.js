import axios from "axios";
console.log(process.env.API_GIS_URL);
const apiGis = axios.create({
    withCredentials: false,
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiGis;