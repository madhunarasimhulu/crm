import appInitialState from '../store/initialState';

const { serviceRequests: initialState } = appInitialState;

const serviceRequests = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_SERVICE_HISTORY':
      return {
        ...state,
        serviceRequestsHistory: action.data,
        isLoading: false,
      };
    case 'SET_SERVICE_REQUESTS_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };
    case 'SET_SERVICE_REQUESTS_ERROR':
      return {
        ...state,
        errorMsg: action.data,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default serviceRequests;
