import {
  GET_CONTACTS,
  GET_CONTACT_SELECTED,
  DELETE_CONTACT_SELECTED,
  GET_ALL_CONTACTS,
} from '../actions/contactAction';

const initialState = {
  contactData: [],
  isSelected: [],
  allContact: [],
};

function contactReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contactData: action?.payload?.data,
      };
    case GET_ALL_CONTACTS:
      return {
        ...state,
        allContact: action?.payload?.data,
      };
    case GET_CONTACT_SELECTED:
      return {
        ...state,
        isSelected: [
          ...state.isSelected.filter((item) => item !== action?.payload),
          action?.payload,
        ],
      };
    case DELETE_CONTACT_SELECTED:
      return {
        ...state,
        isSelected: [
          ...state.isSelected.filter((item) => item !== action?.payload),
        ],
      };
    default:
      return state;
  }
}

export default contactReducer;
