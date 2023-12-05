import appInitialState from '../store/initialState';

const { rules: initialState } = appInitialState;

const rulesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_TRAVEL_NOTIFICATION':
      return {
        ...state,
        travelNotification: action.data,
        isLoading: false,
        hasError: false,
      };

    case 'SET_TRAVEL_NOTIFICATION_LOADING':
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };

    case 'SET_TRAVEL_NOTIFICATION_ERROR':
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };

    default:
      return state;
  }
};

export default rulesReducer;
