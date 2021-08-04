import socket from '../../socket';
import api  from '../../api'
export const SOCKET_NEW_MESSAGE = 'SOCKET_NEW_MESSAGE';
export const GET_CHAT_HISTORY = 'GET_CHAT_HISTORY';
export const SET_CHAT_HISTORY = 'SET_CHAT_HISTORY'

export const newMessage = () => {
  return (dispatch) => {
    socket.getInstance().on('NEW_MESSAGE', (data) => {
      dispatch({
        type: 'SOCKET_NEW_MESSAGE',
        paload: data,
      });
    })
  };
};

export const getChatHistory = () => {
  return  async(dispatch) => {
    await api.chat.getChatHistory().then(res => {
      dispatch({
        type: 'GET_CHAT_HISTORY',
        payload: res.data
      })
    })
  }
}

export const setHistoryChat = (data) => {
  return{
    type: 'SET_CHAT_HISTORY',
    payload: data
  }
}
