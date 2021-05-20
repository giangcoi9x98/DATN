import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import createSocketIoMiddleware from 'redux-socket.io';
import { persistReducer } from 'redux-persist';
import socketInstance from '../socket'
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import socketMiddleware from './middlewares/socketMiddleWare';

const persistConfig = {
  key: 'root',
  storage,
}

// console.log('object');
var socket = socketInstance.getInstance()

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [  thunk, socketMiddleware(socket)];
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(applyMiddleware(...middlewares))
);
export default store;
