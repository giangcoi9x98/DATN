import socket from '../../socket';

export const SOCKET_NEW_MESSAGE = 'SOCKET_NEW_MESSAGE';

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
