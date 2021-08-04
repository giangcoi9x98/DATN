import axios from 'axios';
import config from '../configs';
//import router from "./router";
import jwt from 'jsonwebtoken';
const API_BASE = config.API_BASE;
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = token;
}

const axiosInstance = axios.create({
  baseURL: API_BASE,
  // timeout: 10000, //time in miliseconds
  headers: {
    'Content-Type': 'application/json;',
  },
});

const refreshAccessToken = () =>
  axiosInstance
    .post('/users/refresh_token', {
      refresh_token: localStorage.getItem('refresh_token'),
    })
    .then((tokenRefreshResponse) => {
      localStorage.setItem('token', tokenRefreshResponse.data.data.token);
      localStorage.setItem(
        'refresh_token',
        tokenRefreshResponse.data.data.refresh_token
      );
      return tokenRefreshResponse.data.data.token;
    })
    .catch((err) => {
      const errType = ((err.response || {}).data || {}).type;
      if (
        errType === 'TOKEN_EXPIRED' ||
        errType === 'TOKEN_INVALID' ||
        !localStorage.getItem('refresh_token')
        || err.response.status === 422
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      }
    });

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: localStorage.getItem('token'),
      'Content-Type': 'application/json',
    };
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

if (jwt.decode(token)) {
// let time;
  setInterval(() => {
    return refreshAccessToken();
  }, 3600* 900);
}

//refresh token with response 401
axiosInstance.interceptors.response.use(
  (response) => {
    //window.NProgress.start();
    return response;
  },
  async function (error) {
    // window.NProgress.start();
    const errorResponse = error.response;
    // if (errorResponse.status === 422) {
    //   return errorResponse;
    // }
    // Reject promise if usual error
    //check if error status is Unauthentication. Then try to refresh token
    if (errorResponse.status === 401 && !error.response.config._retry && error.response.status !== 422) {
      // error.response.config._retry = true;
      return refreshAccessToken().then((access_token) => {
        const authorization = 'Bearer ' + access_token;
        // axios.defaults.headers.common['Authorization'] = authorization
        error.response.config.headers['Authorization'] = authorization;
        error.response.config.baseURL = API_BASE;
        return axiosInstance(error.response.config);
      });
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // window.NProgress.done();
    return response;
  },
  function (error) {
    //window.NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance;
