import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://casa-da-saude.test/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

export default axiosInstance;