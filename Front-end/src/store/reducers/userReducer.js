import { GET_PROFILE,GET_IMAGES } from '../actions/userAction';

const initialState = {
  userData: {},
  isOnline: false,
  images:[]
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        userData: action.payload,
      };
    case GET_IMAGES: {
      return {
        ...state,
        images: action.payload
      }
    }  
    default:
      return state;
  }
}

export default userReducer;
