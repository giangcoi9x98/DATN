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
    console.log("error", error)
    return false;
  }
}