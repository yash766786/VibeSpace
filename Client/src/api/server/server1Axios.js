import axios from 'axios';
import { conf } from '../../conf/conf';

const server1Json = axios.create({
    baseURL: conf.server1Url,
    withCredentials: true, // ✅ MUST-HAVE for cookies
});

server1Json.interceptors.request.use((config) => {
    // Since JWT is in cookies, no need to add Authorization
    config.headers['Content-Type'] = 'application/json'; // Still needed for JSON requests
    return config;
});


const server1Form = axios.create({
    baseURL: conf.server1Url,
    withCredentials: true,
});

server1Form.interceptors.request.use((config) => {
    // No Content-Type — browser handles it automatically for FormData
    return config;
});

export { server1Form, server1Json };