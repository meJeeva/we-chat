import axios from 'axios'

const BASE_URL = 'http://192.168.1.40:3000';


const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use(
    (req) => {
        let token = '';
        if (token) req.headers.Authorization = `Bearer ${token}`;

        return req;
    },
    (err) => {
        console.log('error in api axios request interceptors')
        return Promise.reject(err);
    }
)

api.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        console.log('error in api axios response interceptors');
        return Promise.reject(err);
    }
)


const POST = async (path, data = {}, config = {}) => api.post(path, data, { ...config });
const GET = async (path, params = {}, config = {}) => api.get(path, { params, ...config });
const DELETE = async (path, params = {}, config = {}) => api.delete(path, { params, ...config });
const PUT = async (path, data = {}, config = {}) => api.put(path, data, { ...config });

export {
    POST,
    GET,
    PUT,
    DELETE,
    BASE_URL
}