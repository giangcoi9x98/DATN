import io from 'socket.io-client';
import config from '../configs';

const SOCKET_URL = config.BASE_URL || '192.168.0.132:3000';
var instance;
const init = function () {
  instance = io(SOCKET_URL, {
    auth: {
      token: localStorage.getItem('token'),
    },
    reconnection: true,
    // cors: {
    //   origin: "http://localhost:3000",
    //   credentials: false
    // }
  });
  instance.on('error', (data) => console.log('err', data));
  instance.on('connect_error', (data) => console.log('err', data));
  instance.on('connect', async (data) => {});
  instance.on('thien', (data) => {});
  instance.on('disconnect', (data) => {
    instance.removeAllListeners();
  });
  console.log('init socket client', SOCKET_URL);
  return instance;
};

// eslint-disable-next-line import/no-anonymous-default-export
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
