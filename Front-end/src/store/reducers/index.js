import { combineReducers } from 'redux';
import lang from './changeLanguageReducer';
import user from './userReducer';
import post from './postReducer'

const rootReducer = combineReducers({
  lang,
  user,
  post
});

export default rootReducer;