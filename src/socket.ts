import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

type EventHandler = (...args: any[]) => void;

const eventHandlersMap = new Map<string, Set<EventHandler>>();

// 소켓 생성 및 초기화
function createSocket() {
  if (socket && socket.connected) return socket;

  const memberId = localStorage.getItem('memberId');
  const coupleId = localStorage.getItem('coupleId');
  const token = localStorage.getItem('token');

  if (!memberId || !token) return null;

  socket = io('http://localhost:5000', {
    query: { memberId, coupleId },
    auth: { token },
    withCredentials: true,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ 소켓 연결 성공:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ 소켓 연결 에러:', err.message);
  });

  // 이벤트 핸들러 자동 재등록 (소켓 재연결 시)
  socket.io.on('reconnect', () => {
    eventHandlersMap.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        socket?.on(event, handler);
      });
    });
  });

  return socket;
}

export function getSocket(): Socket | null {
  if (socket && socket.connected) return socket;
  return createSocket();
}

export function onSocket(event: string, handler: EventHandler) {
  const s = getSocket();
  if (!s) return;

  // 중복 등록 방지
  if (!eventHandlersMap.has(event)) {
    eventHandlersMap.set(event, new Set());
  }
  const handlers = eventHandlersMap.get(event)!;
  if (!handlers.has(handler)) {
    handlers.add(handler);
    s.on(event, handler);
  }
}

export function offSocket(event: string, handler: EventHandler) {
  if (!socket) return;

  const handlers = eventHandlersMap.get(event);
  if (!handlers) return;

  if (handlers.has(handler)) {
    handlers.delete(handler);
    socket.off(event, handler);
  }

  if (handlers.size === 0) {
    eventHandlersMap.delete(event);
  }
}

export function emitSocket(event: string, ...args: any[]) {
  const s = getSocket();
  if (!s) return;
  s.emit(event, ...args);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    eventHandlersMap.clear();
  }
}
