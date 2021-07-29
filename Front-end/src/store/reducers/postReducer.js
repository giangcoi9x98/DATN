import {
  GET_ALL_POST,
  GET_NOTI_POST,
  GET_MY_POST,
  SET_HISTORY_POST_LIKE,
} from '../actions/postAction';

const initialState = {
  postData: [],
  postNoti: [],
  myPosts: [],
};
function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POST:
      return {
        ...state,
        postData: action.payload,
      };
    case GET_MY_POST:
      return {
        ...state,
        myPosts: action.payload,
      };
    case GET_NOTI_POST:
      return {
        ...state,
        postNoti: action.payload,
      };
    case SET_HISTORY_POST_LIKE: {
      const data = state;
      let flag = true;
      if (!data.postNoti.length) {
        data.postNoti = [...data.postNoti, action.payload];
      }
      data.postNoti.filter((e) => {
        if (e?.post?.id === action.payload.postId) {
          if (action.payload?.type === 'comment') {
            e.post.totalComment += 1;
          } else {
            e.post.totalLike += 1;
          }
          flag = false;
        }
        return data;
      });
      if (flag) data.postNoti = [...data.postNoti, action.payload];
      return data;
    }
    default:
      return state;
  }
}

export default postReducer;
