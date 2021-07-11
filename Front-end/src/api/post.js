import axiosInstance from './api';

export const newPost = async ({ content, img = [] }) => {
  try {
    const res = await axiosInstance.post('post', {
      content: content,
      img: img,
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err);
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
    console.log(err);
    return {
      status: false,
      mesage: ' get All Post fail',
    };
  }
};

export const getAllMyPost = async () => {
  try {
    const res = await axiosInstance.get('/mypost');
    return {
      status: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      mesage: ' get All Post fail',
    };
  }
};


export const getNotiPost = async () => {
  try {
    const res = await axiosInstance.get('/history');
    return {
      status: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err);
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
    console.log(err);
    return {
      status: false,
      mesage: ' get Fail By ID',
    };
  }
};

export const likePost = async (postId) => {
  try {
    const res = await axiosInstance.post('/like', {
      postId: postId,
    });
    return {
      status: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      mesage: ' Like error',
    };
  }
};

export const addComment = async (postId, content, img ="") => {
  try {
    const res = await axiosInstance.post('/comment', {
      postId: postId,
      content: content,
      img: img
    });
    return {
      status: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      mesage: ' comment error',
    };
  }
};

