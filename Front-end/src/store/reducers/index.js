import { combineReducers } from 'redux';
import lang from './changeLanguageReducer';
import user from './userReducer';

const rootReducer = combineReducers({
  lang,
  user
});

export default rootReducer;