import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import createSocketIoMiddleware from 'redux-socket.io';
import { persistReducer } from 'redux-persist';
import socketInstance from '../socket'
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// const persistConfig = {
//   key: 'root',
//   storage,
// }
// console.log('object');
var socket = socketInstance.getInstance()
function optimisticExecute(action, emit, next, dispatch) {
  console.log("action", action)
  emit('action', action);
  const optimisticAction = {
    ...action,
    type: 'SOCKET_NEW_MESSAGE' 
  };
   dispatch(optimisticAction);
}
let socketIoMiddleware = createSocketIoMiddleware(socket, 'NEW_MESSAGE',{ execute: optimisticExecute });

//const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [ socketIoMiddleware, thunk];
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(applyMiddleware(...middlewares))
);
export default store;
