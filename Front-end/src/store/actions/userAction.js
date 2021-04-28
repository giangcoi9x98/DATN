import api from '../../api';

export const GET_PROFILE = 'GET_PRO_FILE';

export const getProfile = () => {
  return (dispatch) => {
    api.user.getProfile().then((res) => {
      dispatch({
        type: 'GET_PROFILE',
        payload: res.data
      });
    });
  };
};
