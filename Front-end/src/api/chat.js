import axiosInstance from './api';

export const send = async ({ message, roomId }) => {
  try {
    const res = await axiosInstance.post('/chat', {
      message: message,
      roomId: roomId,
    });
    return res.data;
  } catch (error) {
    return false;
  }
};

export const getChatHistory = async () => {
  try {
    const res = await axiosInstance.get('/chat');
    return res.data;
  } catch (error) {
    return false;
  }
};
