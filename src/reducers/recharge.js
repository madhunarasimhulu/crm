import appInitialState from '../store/initialState';

const { recharge: initialState } = appInitialState;

const rechargeReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_RECHARGE':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_RECHARGE':
      return {
        ...initialState,
      };

    case 'SET_GENERATED_RECHARGE':
      return {
        ...state,
        generated: action.data,
        isSubmitting: false,
      };

    case 'SET_RECHARGE_AMOUNT_INPUT':
      return {
        ...state,
        amountInput: action.data,
      };

    case 'SET_RECHARGE_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_RECHARGE_COPIED':
      return {
        ...state,
        hasCopied: action.data,
      };

    case 'SET_RECHARGE_SMS_SENDING':
      return {
        ...state,
        isSendingSMS: action.data,
      };

    case 'SET_RECHARGE_SMS_SENT':
      return {
        ...state,
        isSendingSMS: false,
        hasSentSMS: true,
      };

    case 'SET_RECHARGE_EMAIL_SENDING':
      return {
        ...state,
        isSendingEmail: action.data,
      };

    case 'SET_RECHARGE_EMAIL_SENT':
      return {
        ...state,
        isSendingEmail: false,
        hasSentEmail: true,
      };

    default:
      return state;
  }
};

export default rechargeReducer;
