import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TARGET,
  withCredentials:true
});


let accessToken = '';

export function setAccessToken(newToken) {
  accessToken = newToken;
}

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
