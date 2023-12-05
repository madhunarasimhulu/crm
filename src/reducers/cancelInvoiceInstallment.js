import appInitialState from '../store/initialState';

const { cancelInvoiceInstallment: initialState } = appInitialState;

const cancelInvoiceInstallmentReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_CANCEL_INVOICE_INSTALLMENT':
      return {
        ...state,
        isOpen: true,
      };

    case 'RESET_CANCEL_INVOICE_INSTALLMENT':
    case 'CLOSE_CANCEL_INVOICE_INSTALLMENT':
      return {
        ...initialState,
      };

    case 'SET_CANCEL_INVOICE_INSTALLMENT':
      return {
        ...state,
        invoiceInstallment: action.data,
        isSubmitting: false,
        isFetching: false,
      };

    case 'SET_CONFIRM_CANCEL_INVOICE_INSTALLMENT':
      return {
        ...state,
        cancelConfirmed: action.data,
        isSubmitting: false,
      };

    case 'SET_CANCEL_INVOICE_INSTALLMENT_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_CANCEL_INVOICE_INSTALLMENT_ERROR':
      return {
        ...state,
        errorState: true,
        error: action.data,
        isSubmitting: false,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default cancelInvoiceInstallmentReducer;
