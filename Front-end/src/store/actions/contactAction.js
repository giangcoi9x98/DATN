import api from '../../api';

export const GET_CONTACTS = 'GET_CONTACTS';
export const GET_CONTACT_SELECTED= 'GET_CONTACT_SELECTED';
export const DELETE_CONTACT_SELECTED= 'DELETE_CONTACT_SELECTED';

export const getContacts = () => {
  return async (dispatch) => {
    // api.user.getProfile().then((res) => {
    //   console.log("res",res.data.data)
    //
    // });
    await api.user.getAll().then((res) => {
      dispatch({
        type: 'GET_CONTACTS',
        payload: res?.data?.data,
      });
    });
  };
};

export const getContactsSelected = (data) => {
  return {
    type: 'GET_CONTACT_SELECTED',
    payload:data
    }
}

export const deleteContactSelected = (data) => {
  return {
    type: 'DELETE_CONTACT_SELECTED',
    payload:data
    }
}

