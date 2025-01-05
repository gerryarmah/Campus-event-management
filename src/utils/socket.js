import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
});

// Socket event listeners
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

// Reconnection handling
socket.on('reconnect', (attemptNumber) => {
  console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed');
});

// Custom error handling
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Export socket instance
export default socket;

// Helper functions for common socket operations
export const emitEvent = (eventName, data) => {
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      reject(new Error('Socket not connected'));
      return;
    }

    socket.emit(eventName, data, (response) => {
      if (response?.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
};

export const subscribeToEvent = (eventName, callback) => {
  socket.on(eventName, callback);
  return () => socket.off(eventName, callback);
};

export const joinRoom = (roomId) => {
  socket.emit('join_room', roomId);
};

export const leaveRoom = (roomId) => {
  socket.emit('leave_room', roomId);
};