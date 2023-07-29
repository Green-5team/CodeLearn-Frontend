import axios from 'axios';

import { PATH_API, USER_TOKEN_KEY } from '@/constants';
import { getUserToken } from '@/utils';

const axiosConfig = {
  // baseURL: `http://52.69.242.42:3000${PATH_API.room}`,
  baseURL: `http://localhost:3000${PATH_API.room}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const roomInstance = axios.create(axiosConfig);

export const getRoomList = ({ page }: { page: number }) => {
  return roomInstance.get(`?page=${page}`);
};

roomInstance.interceptors.request.use(
  (config) => {
    config.headers[USER_TOKEN_KEY] = getUserToken();
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);
