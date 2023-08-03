import { io } from 'socket.io-client';

import { PATH_API } from '@/constants';

export const attempt = {
  maxCount: 5,
  tryCount: 0,
};

export const socket = io(`https://52.69.242.42:3000${PATH_API.room}`, {
  // export const socket = io(`http://localhost:3000${PATH_API.room}`, {
  extraHeaders: {},
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: attempt.maxCount,
});

// export const gameSocket = io('http://localhost:8000', {
export const gameSocket = io('https://52.69.242.42:8000', {
  path: '/game',
});
