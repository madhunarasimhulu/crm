import appInitialState from '../store/initialState';

const { callDetails: initialState } = appInitialState;

const callDetailsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CALL_DETAILS':
      return {
        ...state,
        ...action.data,
      };

    case 'COMPLEMENT_CALL_DETAILS':
      return {
        ...state,
        events: action.data,
        isLoadingEvents: false,
      };

    case 'RESET_CALL_DETAILS':
      return {
        ...initialState,
      };

    case 'SET_CALL_EVENTS_LOADING':
      return {
        ...state,
        isLoadingEvents: action.data,
      };

    default:
      return state;
  }
};

export default callDetailsReducer;
