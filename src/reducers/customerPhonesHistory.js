import appInitialState from '../store/initialState';

const { customerPhonesHistory: initialState } = appInitialState;

const customerPhonesHistoryReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER_PHONES_HISTORY':
      return {
        ...state,
        ...action.data,
        isLoading: false,
        error: false,
        errorMsg: '',
        hasLoadedAtLeastOnce: true,
      };

    case 'SET_CUSTOMER_PHONES_HISTORY_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'SET_CUSTOMER_PHONES_HISTORY_ERROR':
      return {
        ...state,
        ...action.data,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default customerPhonesHistoryReducer;
