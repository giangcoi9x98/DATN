import api from '../../api';

export const GET_CONTACTS= 'GET_CONTACTS';
export const getContacts = () => {
  return async (dispatch) => {
    // api.user.getProfile().then((res) => {
    //   console.log("res",res.data.data)
    //
    // });
    await api.user.getAll().then((res) => {
      dispatch({
        type: 'GET_CONTACTS',
        payload: res.data.data,
      });
    });
  };
};
