import appInitialState from '../store/initialState';

const { cardPasswordChange: initialState } = appInitialState;

const cardPasswordChangeReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_CARD_PASSWORD_CHANGE':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CARD_PASSWORD_CHANGE':
    case 'RESET_CARD':
      return {
        ...initialState,
      };

    case 'SET_CARD_PASSWORD_CHANGE_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };
    case 'SHOW_OTP_CARD_PASSWORD_CHANGE':
      return {
        ...state,
        showOtpField: true,
      };
    default:
      return state;
  }
};

export default cardPasswordChangeReducer;
