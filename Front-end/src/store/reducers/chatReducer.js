import socket from '../../socket';
import { SOCKET_NEW_MESSAGE, GET_CHAT_HISTORY, SET_CHAT_HISTORY } from '../actions/chatAction';
const initialState = {
  history:[]
};

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case SOCKET_NEW_MESSAGE: {
      return state
    }
    case GET_CHAT_HISTORY: {
      return {
        ...state,
        history:action.payload
      }
    }
    case SET_CHAT_HISTORY:{
      return {
        ...state,
        history:[...state.history.filter(item => item.accountId !== action.payload.accountId ), action.payload]
      }  
    }
    default:
      return state;
  }
}

export default chatReducer;
