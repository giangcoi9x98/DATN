import { GET_ALL_POST } from '../actions/postAction';

const initialState = {
  postData: [],
};
function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POST:
      console.log("action.payload", action)
      return {
        ...state,
        postData: action.payload,
      };
    default:
      return state;
  }
}

export default postReducer;
