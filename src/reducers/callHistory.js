import appInitialState from '../store/initialState';

const { callHistory: initialState } = appInitialState;

const callHistoryReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CALL_HISTORY':
      if (action.data.current_page > 1) {
        return {
          ...state,
          current_page: action.data.current_page,
          isLoading: false,
          isLoadingMore: false,
          items: state.items.concat(action.data.items),
          next_page: action.data.next_page,
        };
      }

      return {
        ...state,
        ...action.data,
        isLoading: false,
        isLoadingMore: false,
      };

    case 'RESET_CALL_HISTORY':
      return {
        ...initialState,
      };

    case 'SET_CALL_HISTORY_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'SET_CALL_HISTORY_LOADING_MORE':
      return {
        ...state,
        isLoadingMore: action.data,
      };

    case 'SET_CALL_DETAILS':
      return {
        ...state,
        selectedProtocol: action.data.protocol,
      };

    default:
      return state;
  }
};

export default callHistoryReducer;
