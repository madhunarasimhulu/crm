import appInitialState from '../store/initialState';

const { onBoard: initialState } = appInitialState;

const onBoardReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'CUSTOMER_ONBOARD_LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'SET_CUSTOMER_ONBOARD_DATA':
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case 'CUSTOMER_ONBOARD_ERROR':
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    case 'SET_CUSTOMER_ONBOARD_OTP':
      return {
        ...state,
        isLoading: false,
        otpData: action.data,
      };

    case 'SAVE_CUSTOMER_ONBOARD_ACCOUNT_DATA':
      return {
        ...state,
        isLoading: false,
        account: action.data,
      };
    case 'SET_CLIENT_ID':
      return {
        ...state,
        clientId: action.data,
      };
    default:
      return state;
  }
};

export default onBoardReducer;
