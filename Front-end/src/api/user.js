import axiosInstance from './api';

export const signUp = async ({ fullname, password, birthday, email }) => {
  try {
    const res = await axiosInstance.post('/user/register', {
      fullname: fullname,
      password: password,
      birthday: birthday,
      email: email,
    });
    return {
      status: true,
      data: res,
    };
  } catch (error) {
    return {
      status: false,
      data: error.response.data,
      message: 'sign up failed',
    };
  }
};
export const getAll = async (email) => {
  try {
    const res = await axiosInstance.get(`/accounts?email=${email}`);
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
export const getAllConatct = async () => {
  try {
    const res = await axiosInstance.get(`/contacts`);
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
export const updateAccount = async ({
  fullname,
  company,
  phone,
  birthday,
  gender,
}) => {
  try {
    const res = await axiosInstance.put(`/user/profile`, {
      fullname: fullname,
      company: company,
      phone: phone,
      birthday: birthday,
      gender: gender,
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (e) {
    return {
      status: false,
      data: e.response.data,
    };
  }
};
export const updateAvatar = async ({
  avatar,
}) => {
  try {
    const res = await axiosInstance.put(`/user/avatar`, {
      avatar: avatar,
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (e) {
    return {
      status: false,
      data: e.response.data,
    };
  }
};
export const updateBackground = async ({
  background
}) => {
  try {
    const res = await axiosInstance.put(`/user/background`, {
      background: background
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (e) {
    return {
      status: false,
      data: e.response.data,
    };
  }
};
export const changePassword = async ({
  currentPassword,
  newPassword,
  repeatPassword,
}) => {
  try {
    const res = await axiosInstance.put(`/user/changePassword`, {
      currentPassword: currentPassword,
      newPassword: newPassword,
      repeatPassword: repeatPassword,
    });
    return {
      status: true,
      data: res.data,
    };
  } catch (error) {
    return {
      status: false,
      data: error.response.data,
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
    const res = await axiosInstance.get(`/user/email/${email}`);
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
