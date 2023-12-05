import appInitialState from '../store/initialState';

const { transaction: initialState } = appInitialState;

const transactionReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_TRANSACTION':
      return {
        ...action.data,
        isLoading: false,
      };

    case 'SET_TRANSACTION_ERROR':
      return {
        ...initialState,
        ...action.data,
        isLoading: false,
      };

    case 'SET_TRANSACTION_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'RESET_TRANSACTION':
      return {
        ...initialState,
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};

export default transactionReducer;
