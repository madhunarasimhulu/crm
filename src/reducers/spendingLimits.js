import appInitialState from '../store/initialState';

const { spendingLimits: initialState } = appInitialState;

const spendingLimits = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_SPENDING_LIMIT_CHANNEL':
      return {
        ...state,
        channels: {
          ...state.channels,
          ...action.data,
        },
      };
    case 'SET_SPENDING_LIMITS_LOADING':
      return {
        ...state,
        loading: action.data,
      };
    case 'RESET_SPENDINGLIMIT_CHANNELS':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default spendingLimits;
