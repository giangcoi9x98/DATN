import api from '../../api';

export const GET_CONTACTS = 'GET_CONTACTS';
export const GET_ALL_CONTACTS = 'GET_ALL_CONTACTS';
export const GET_CONTACT_SELECTED = 'GET_CONTACT_SELECTED';
export const DELETE_CONTACT_SELECTED = 'DELETE_CONTACT_SELECTED';

export const getContacts = (email = '') => {
  return async (dispatch) => {
    // api.user.getProfile().then((res) => {
    //   console.log("res",res.data.data)
    //
    // });
    if (email) {
      await api.user.getAll(email).then((res) => {
        dispatch({
          type: 'GET_CONTACTS',
          payload: res?.data?.data,
        });
      });
    } else {
      await api.user.getAllConatct().then((res) => {
        dispatch({
          type: 'GET_ALL_CONTACTS',
          payload: res?.data?.data,
        });
      });
    }
  };
};

export const getContactsSelected = (data) => {
  return {
    type: 'GET_CONTACT_SELECTED',
    payload: data,
  };
};

export const deleteContactSelected = (data) => {
  return {
    type: 'DELETE_CONTACT_SELECTED',
    payload: data,
  };
};
