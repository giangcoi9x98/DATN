import { GET_ALL_POST, GET_NOTI_POST } from '../actions/postAction';

const initialState = {
  postData: [],
  postNoti: []
};
function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POST:
      return {
        ...state,
        postData: action.payload,
      };
      case GET_NOTI_POST:
        return {
          ...state,
          postNoti: action.payload,
        };
    default:
      return state;
  }
}

export default postReducer;
