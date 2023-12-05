import appInitialState from '../store/initialState';

const { splitInvoice: initialState } = appInitialState;

const splitInvoiceReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_PAYMENT_SPLIT_INVOICE':
      return {
        ...state,
        ...action.data,
      };

    case 'SHOW_SPLIT_INVOICE':
      return {
        ...state,
        show: true,
      };

    case 'SHOW_REVIEW_SPLIT_INVOICE':
      return {
        ...state,
        reviewSplitInvoice: true,
      };

    case 'RESET_SPLIT_INVOICE':
      return {
        ...initialState,
      };

    case 'SET_GENERATED_SPLIT_INVOICE':
      return {
        ...state,
        generated: action.data,
        isSubmitting: false,
      };

    case 'SET_TOTAL_DUE_SPLIT_INVOICE':
      return {
        ...state,
        splitOptions: {
          ...action.data,
        },
        isFetchingTotalDue: false,
      };

    case 'SET_SPLIT_INVOICE_AMOUNT_INPUT':
      return {
        ...state,
        amountInput: action.data,
      };

    case 'SET_SPLIT_INVOICE_AMOUNT_SLIDER':
      return {
        ...state,
        sliderInput: action.data,
      };

    case 'SET_SPLIT_INVOICE_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_SPLIT_INVOICE_COPIED':
      return {
        ...state,
        hasCopied: action.data,
      };

    case 'SET_SPLIT_INVOICE_SMS_SENDING':
      return {
        ...state,
        isSendingSMS: action.data,
      };

    case 'SET_SPLIT_INVOICE_SMS_SENT':
      return {
        ...state,
        isSendingSMS: false,
        hasSentSMS: true,
      };

    case 'SET_SPLIT_INVOICE_EMAIL_SENDING':
      return {
        ...state,
        isSendingEmail: action.data,
      };

    case 'SET_SPLIT_INVOICE_EMAIL_SENT':
      return {
        ...state,
        isSendingEmail: false,
        hasSentEmail: true,
      };

    case 'SET_TOTALS_SPLIT_INVOICE_ERROR':
      return {
        ...state,
        errorState: true,
        error: action.data,
        isSubmitting: false,
        isFetchingTotalDue: false,
      };

    default:
      return state;
  }
};

export default splitInvoiceReducer;
