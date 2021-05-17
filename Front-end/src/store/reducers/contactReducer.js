import { GET_CONTACTS } from '../actions/contactAction';

const initialState = {
  contactData:[]
};

function contactReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contactData: action.payload.data,
      };

    default:
      return state;
  }
}

export default contactReducer;
