import { LANGUAGE_CHANGE } from '../actions/changeLanguageAction';

const initialState = {
  lang : localStorage.getItem('i18nextLng') || 'en'
}
function langReducer(state = initialState, action) {
  switch (action.type) {
    case LANGUAGE_CHANGE:
      return {
        ...state,
        lang: action.payload
      };
    default:
      return state
  }
}

export default langReducer;