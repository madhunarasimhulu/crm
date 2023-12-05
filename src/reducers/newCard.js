import appInitialState from '../store/initialState';

const { newCard: initialState } = appInitialState;

const newCardReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_NEW_CARD_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          [action.data.name]: action.data.value,
        },
      };

    case 'RESET_NEW_CARD_FORM':
      return {
        ...initialState,
      };

    case 'SET_NEW_CARD_FORM_VALIDITY':
      return {
        ...state,
        isValid: action.data,
      };

    case 'OPEN_NEW_CARD_CONFIRMATION':
      return {
        ...state,
        isConfirmationOpen: true,
      };

    case 'CLOSE_NEW_CARD_CONFIRMATION':
      return {
        ...initialState,
      };

    case 'SET_NEW_CARD_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_NEW_CARD_OUTCOME':
      return {
        ...state,
        outcome: action.data,
      };

    case 'SET_NEW_CARD_REASONS':
      return {
        ...state,
        reasons: action.data,
      };

    default:
      return state;
  }
};

export default newCardReducer;
