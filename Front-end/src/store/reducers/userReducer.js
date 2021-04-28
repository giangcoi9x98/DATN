import { GET_PROFILE } from '../actions/userAction';

const initialState = {
  user: {},
  isOnline: false,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export default userReducer;
