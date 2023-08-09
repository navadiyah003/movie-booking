import axios from 'axios';
import { API_ROOT } from './consts';


const axiosInstance = axios.create({
    baseURL: API_ROOT,
});

// Custom method to make API calls
const Axios = (method, url, data = null, config = {}) => {
    if (config.authRequest && config.token) {
        config.headers = { ...axiosInstance.headers, ...config.headers, Authorization: `Bearer ${config.token}` };
    }
    return axiosInstance({
        method,
        url,
        data,
        ...config,
    });
};

export default Axios;
