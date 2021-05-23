import socket from '../../socket';
import api  from '../../api'
export const SOCKET_NEW_MESSAGE = 'SOCKET_NEW_MESSAGE';
export const GET_CHAT_HISTORY = 'GET_CHAT_HISTORY';

export const newMessage = () => {
  return (dispatch) => {
    socket.getInstance().on('NEW_MESSAGE', (data) => {
      console.log("onmesage")
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
      console.log(res.data)
      dispatch({
        type: 'GET_CHAT_HISTORY',
        payload: res.data
      })
    })
  }
}
