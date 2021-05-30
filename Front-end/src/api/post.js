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
      mesage: ' get All Post fail',
    };
  }
};

export const getById = async (id) => {
  try {
    const res = await axiosInstance.get(`/post/${id}`);
    return {
      status: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err)
    return {
      status: false,
      mesage: ' get Fail By ID',
    };
  }
};