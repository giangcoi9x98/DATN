import axiosInstance from './api';

export const newPost = async ({ content, img = [] }) => {
  try {
    const res = await axiosInstance.post('post', {
      content: content,
      img:img
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err)
    return {
      status: false,
      mesage: ' post falied',
    };
  }
};

export const getAllPost = async () => {
  try {
    const res = await axiosInstance.get('/post');
    return {
      status: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err)
    return {
      status: false,
      mesage: ' login falied',
    };
  }
};