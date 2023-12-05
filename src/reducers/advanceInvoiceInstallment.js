import appInitialState from '../store/initialState';

const { advanceInvoiceInstallment: initialState } = appInitialState;

const advanceInvoiceInstallmentReducer = (
  state = initialState,
  action = {},
) => {
  switch (action.type) {
    case 'UPDATE_ADVANCE_INVOICE_INSTALLMENT':
      return {
        ...state,
        ...action.data,
      };

    case 'OPEN_ADVANCE_INVOICE_INSTALLMENT':
      return {
        ...state,
        isOpen: true,
      };

    case 'RESET_ADVANCE_INVOICE_INSTALLMENT':
    case 'CLOSE_ADVANCE_INVOICE_INSTALLMENT':
      return {
        ...initialState,
      };

    case 'SET_ADVANCE_INVOICE_INSTALLMENT':
      return {
        ...state,
        invoiceInstallment: action.data,
        isSubmitting: false,
        isFetching: false,
      };

    case 'SET_CONFIRM_ADVANCE_INVOICE_INSTALLMENT':
      return {
        ...state,
        cancelConfirmed: action.data,
        isSubmitting: false,
      };

    case 'SET_ADVANCE_INVOICE_INSTALLMENT_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_ADVANCE_INVOICE_INSTALLMENT_ERROR':
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

export default advanceInvoiceInstallmentReducer;
