import socket from '../../socket';
import { SOCKET_NEW_MESSAGE } from '../actions/chatAction';
const initialState = {};

function chatReducer(state = initialState, action) {
  switch (action.payload) {
    case SOCKET_NEW_MESSAGE: {
      console.log('socket', action.payload);
      return state
    }
    default:
      return state;
  }
}

export default chatReducer;
