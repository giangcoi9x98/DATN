import { GET_PROFILE,SET_PROFILE } from '../actions/userAction';

const initialState = {
  userData: {},
  isOnline: false,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      console.log("action",action)
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
}

export default userReducer;
