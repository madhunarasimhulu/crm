import appInitialState from '../store/initialState';

const { bankAccounts: initialState } = appInitialState;

const bankAccountsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_LIMITS':
      return {
        ...state,
        isLoading: false,
        limits: action.data,
      };

    case 'SET_LIMITS_LOADING':
      return {
        ...state,
        isLoading: true,
      };

    case 'SET_LIMITS_ERROR':
      return {
        ...state,
        isLoading: false,
      };

    case 'SET_ACCOUNT_HOLDERS':
      return {
        ...state,
        isLoading: false,
        accountHolders: action.data,
      };

    case 'SET_ACCOUNT_HOLDERS_LOADING':
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
};

export default bankAccountsReducer;
