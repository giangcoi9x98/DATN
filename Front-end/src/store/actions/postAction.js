import api from '../../api';

export const GET_ALL_POST = 'GET_ALL_POST';
export const GET_NOTI_POST = 'GET_NOTI_POST';
export const GET_MY_POST = 'GET_MY_POST';
export const SET_HISTORY_POST_LIKE = 'SET_HISTORY_POST_LIKE';

export const fetchAllPost = () => {
  return async (dispatch) => {
    await api.post.getAllPost().then((res) => {
      dispatch({
        type: 'GET_ALL_POST',
        payload: res?.data?.data,
      });
    });
  };
};

export const getAllNotiPost = () => {
  return async (dispatch) => {
    await api.post.getNotiPost().then((res) => {
      dispatch({
        type: 'GET_NOTI_POST',
        payload: res?.data?.data,
      });
    });
  };
};

export const fetchMyPosts = (email) => {
  return async (dispatch) => {
    await api.post.getAllMyPost(email).then((res) => {
      dispatch({
        type: 'GET_MY_POST',
        payload: res?.data?.data,
      });
    });
  };
};

export const setHistoryPostInteractive = (data) => {
  return {
    type: 'SET_HISTORY_POST_LIKE',
    payload: data,
  };
};
