import { combineReducers } from 'redux';
import lang from './changeLanguageReducer';
import user from './userReducer';
import post from './postReducer';
import chat from './chatReducer';
import contact from './contactReducer'

const rootReducer = combineReducers({
  lang,
  user,
  post,
  chat,
  contact
});

export default rootReducer;