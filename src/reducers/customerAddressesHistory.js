import appInitialState from '../store/initialState';

const { customerAddressesHistory: initialState } = appInitialState;

const customerAddressesHistoryReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER_ADDRESSES_HISTORY':
      return {
        ...state,
        ...action.data,
        isLoading: false,
        error: false,
        errorMsg: '',
        hasLoadedAtLeastOnce: true,
      };

    case 'SET_CUSTOMER_ADDRESSES_HISTORY_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'SET_CUSTOMER_ADDRESSES_HISTORY_ERROR':
      return {
        ...state,
        ...action.data,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default customerAddressesHistoryReducer;
