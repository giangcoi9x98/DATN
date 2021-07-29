import { GET_CONTACTS, GET_CONTACT_SELECTED, DELETE_CONTACT_SELECTED } from '../actions/contactAction';

const initialState = {
  contactData: [],
  isSelected: [],
};

function contactReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contactData: action?.payload?.data,
      };
    case GET_CONTACT_SELECTED:
    return {
      ...state,
      isSelected: [...state.isSelected.filter(item => item !== action?.payload), action?.payload]
    }
    case DELETE_CONTACT_SELECTED:
      return {
        ...state,
        isSelected: [...state.isSelected.filter(item => item !== action?.payload)]
      }
    default:
      return state;
  }
}

export default contactReducer;


