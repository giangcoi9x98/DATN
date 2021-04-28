import axiosInstance from './api';

export const logIn = async ({ email, password }) => {
  try {
    const res = await axiosInstance.post('/user/login', {
      email: email,
      password: password,
    });
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
export const logOut = async () => {
  try {
    const res = axiosInstance.post('/user/logout', {
      token:localStorage.getItem('token')
    });
    return {
      status: true,
      data:(await res).data
    }
  } catch (e) {
    return {
      status:false
    }
  }
}