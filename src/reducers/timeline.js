import appInitialState from '../store/initialState';

const { timeline: initialState } = appInitialState;

const timelineReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_TIMELINE_EVENTS':
      return {
        ...state,
        ...action.data,
        items: state.items.concat(
          action.data.items?.filter(
            (item) =>
              item?.type.toUpperCase() !== 'ACCOUNT_PROGRAM_MIGRATE' &&
              item?.type.toUpperCase() !== 'STATEMENT-DISPATCH' &&
              item?.type.toUpperCase() !== 'PAYMENT-REMINDER',
          ),
        ),
        pages: action.data.current_page,
        isLoading: false,
        error: false,
        errorMsg: '',
        hasLoadedAtLeastOnce: true,
      };

    case 'SET_TIMELINE_EVENTS_LOADING':
      return {
        ...state,
        isLoading: false,
      };

    case 'SET_TIMELINE_EVENTS_ERROR':
      return {
        ...state,
        ...action.data,
        isLoading: false,
      };

    case 'SET_TIMELINE_EVENTS_STOPPED_POOLING':
      return {
        ...state,
        stoppedPooling: action.data,
        isLoading: false,
      };

    case 'RESET_TIMELINE_ITEMS':
      return {
        ...state,
        items: [],
        next_page: false,
      };

    default:
      return state;
  }
};

export default timelineReducer;
