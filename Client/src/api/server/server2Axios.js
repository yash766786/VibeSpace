import axios from 'axios';
import { conf } from '../../conf/conf';

const server2Json = axios.create({
    baseURL: conf.server2Url,
    withCredentials: true, // ✅ MUST-HAVE for cookies
});

server2Json.interceptors.request.use((config) => {
    // Since JWT is in cookies, no need to add Authorization
    config.headers['Content-Type'] = 'application/json'; // Still needed for JSON requests
    return config;
});


const server2Form = axios.create({
    baseURL: conf.server2Url,
    withCredentials: true,
});

server2Form.interceptors.request.use((config) => {
    // No Content-Type — browser handles it automatically for FormData
    return config;
});

export { server2Form, server2Json };