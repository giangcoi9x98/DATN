import api from '../../api';

export const GET_PROFILE = 'GET_PROFILE';
export const SET_PROFILE = 'SET_PROFILE';
export const GET_IMAGES = 'GET_IMAGES';

export const getProfileAction = () => {
  return async (dispatch) => {
    await api.user.getProfile().then((res) => {
      dispatch({
        type: 'GET_PROFILE',
        payload: res?.data?.data[0],
      });
    });
  };
};

export const getAllImages = (email) => {
  return  async (dispatch) => {
    await api.media.getAll(email).then(res => {
      dispatch({
        type: 'GET_IMAGES',
        payload:res?.data
      })
    })
  }
}
