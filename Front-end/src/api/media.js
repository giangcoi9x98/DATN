import axiosInstance from './api';

export const upload = async (formdata) => {
  try {
    const res = await axiosInstance
      .put(
        '/media/upload',
        formdata, {}
    )
    
    return res.data;
  } catch (error) {
    return false;
  }
}

export const getAll = async (email) => {
  try {
    const res = await axiosInstance.get(`/images?email=${email}`)
    return res.data
  } catch (error) {
    return false
  }
}