import io from 'socket.io-client';

const SOCKET_URL =
  process.env.REACT_APP_API_SOCKET_URL || 'localhost:3000';
var instance;
const init = function () {
  instance = io(SOCKET_URL, {
    // auth: {
    //   token: localStorage.getItem('token')
    // },
    reconnection: true,
    // cors: {
    //   origin: "http://localhost:3000",
    //   credentials: false
    // }
  });
  instance.on('NEW_MESSAGE', (data) => {
    console.log('data', data);
  });
  instance.on('error', (data) => console.log('err', data));
  instance.on('connect_error', (data) => console.log('err', data));
  instance.on('connect', (data) => console.log('connect', instance.id, data));
  instance.emit('thien', { name: 123 });
  instance.on('thien', (data) => {
    console.log(data);
  });
  instance.on('disconnect', (data) => {
    console.log('disconnect', data);
    instance.removeAllListeners();
  });
  console.log('init socket client', SOCKET_URL);
  return instance;
};

export default {
  getInstance: function () {
    if (!instance) {
      instance = init();
    }
    return instance;
  },
  clearInstance: function () {
    if (instance) {
      instance.removeAllListeners();
    }
    instance = null;
  },
};
