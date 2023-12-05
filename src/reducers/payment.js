import appInitialState from '../store/initialState';

const { payment: initialState } = appInitialState;

const paymentReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_PAYMENT':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_PAYMENT':
    case 'RESET_STATEMENTS':
      return {
        ...initialState,
      };

    case 'SET_GENERATED_PAYMENT':
      return {
        ...state,
        generated: action.data,
        isSubmitting: false,
      };

    case 'SET_TOTAL_DUE':
      return {
        ...state,
        totalDue: {
          ...action.data,
        },
        amountInput: action.data.closed_due_balance,
        sliderInput: action.data.closed_due_balance,
        isFetchingTotalDue: false,
      };

    case 'SET_PAYMENT_AMOUNT_INPUT':
      return {
        ...state,
        amountInput: action.data.value ? action.data.value : action.data,
        inputValidate: action.data.inputValidate
          ? action.data.inputValidate
          : false,
      };

    case 'SET_PAYMENT_AMOUNT_SLIDER':
      return {
        ...state,
        sliderInput: action.data,
      };

    case 'SET_PAYMENT_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_PAYMENT_COPIED':
      return {
        ...state,
        hasCopied: action.data,
      };

    case 'SET_PAYMENT_SMS_SENDING':
      return {
        ...state,
        isSendingSMS: action.data,
      };

    case 'SET_PAYMENT_SMS_SENT':
      return {
        ...state,
        isSendingSMS: false,
        hasSentSMS: true,
      };

    case 'SET_PAYMENT_EMAIL_SENDING':
      return {
        ...state,
        isSendingEmail: action.data,
      };

    case 'SET_PAYMENT_EMAIL_SENT':
      return {
        ...state,
        isSendingEmail: false,
        hasSentEmail: true,
      };

    case 'SET_TOTAL_DUE_ERROR':
      return {
        ...state,
        errorState: true,
        error: action.data,
        isSubmitting: false,
        isFetchingTotalDue: false,
      };

    case 'SET_PAY_STATEMENT':
      const { data } = action;

      return {
        ...state,
        authorization_id: data.authorization_id,
        available_credit_limit: data.available_credit_limit,
        event_date: data.event_date,
        isLoading: false,
      };

    case 'SET_PAY_STATEMENT_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'SET_MIN_UPFRONT_AMOUNT_SPLIT_INVOICE':
      return {
        ...state,
        minUpfrontAmount: action.data.min_upfront_amount,
      };

    default:
      return state;
  }
};

export default paymentReducer;
