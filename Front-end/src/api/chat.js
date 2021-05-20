import axiosInstance from './api';

export const send = async ({message,roomId}) => {
  try {
    const res = await axiosInstance
      .post('/chat', {
        message: message,
        roomId:roomId
      })
    return res.data;
  } catch (error) {
    console.log("error", error)
    return false;
  }
}