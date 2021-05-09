import api from '../../api';

export const GET_PROFILE = 'GET_PROFILE';
export const SET_PROFILE = 'SET_PROFILE';
export const getProfileAction = () => {
  return async (dispatch) => {
    // api.user.getProfile().then((res) => {
    //   console.log("res",res.data.data)
    //
    // });
    await api.user.getProfile().then((res) => {
      dispatch({
        type: 'GET_PROFILE',
        payload: res.data.data[0],
      });
    });
  };
};
