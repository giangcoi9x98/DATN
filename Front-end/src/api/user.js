import axiosInstance from './api';

export const signUp = async ({
  fullname,
  password,
  birthday,
  email,
}) => {
  try {
    const res = await axiosInstance.post('/user/register', {
      fullname: fullname,
      password: password,
      birthday: birthday,
      email: email,
    });
    console.log(res)
    return {
      status: true,
      data: res,
    };
  } catch (error) {
    return {
      status: false,
      data:error.response.data,
      message: 'sign up failed',
    };
  }
};
export const getAll = async () => {
  try {
    const res = await axiosInstance.get('/accounts');
    return {
      status: true,
      data: res,
    };
  } catch (e) {
    return {
      status: false,
    };
  }
};
export const deleteAcount = async (id) => {
  try {
    const res = await axiosInstance.delete(`/account/${id}`, {});
    return {
      status: true,
      data: res,
    };
  } catch (e) {
    return {
      status: false,
    };
  }
};
export const updateAccount = async (
  id,
  { firstname, lastname, email, phone, address, password },
) => {
  try {
    const res = axiosInstance.put(`/account/${id}`, {
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      address: address,
      password: password,
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (e) {
    return {
      status: false,
    };
  }
};
export const getProfile = async () => {
  try {
    const res = await axiosInstance.get('/user/profile');
    return {
      data: res.data,
      status: true,
    };
  } catch (e) {
    return {
      status: false,
    };
  }
};
export const getByEmail = async (email) => {
  try {
    const res = await axiosInstance.get(`/user/email/${email}` );
    return {
      data: res.data,
      status: true,
    };
  } catch (e) {
    console.log(e)
    return {
      status: false,
    };
  }
};