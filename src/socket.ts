// src/socket.ts
import { io } from 'socket.io-client';

// 로그인 후 받아온 userId, coupleId 값을 넣어야 함.
// 보통 로그인 완료 후 context/store에서 받아서 socket.ts에서 export하는 함수를 통해 소켓 생성하는 방법을 많이 씁니다.

let socket: ReturnType<typeof io> | null = null;

export const connectSocket = (memberId: string, coupleId: string) => {
  if (socket) {
    socket.disconnect();
  }
  socket = io('http://localhost:5000', {
    withCredentials: true,
    query: {
      memberId,
      coupleId,
    },
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not connected. Call connectSocket first.');
  }
  return socket;
};
