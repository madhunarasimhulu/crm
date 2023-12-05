import appInitialState from '../store/initialState';

const { cardUnblock: initialState } = appInitialState;

const cardUnblockReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_CARD_UNBLOCK':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CARD_UNBLOCK':
    case 'RESET_CARD':
      return {
        ...initialState,
      };

    case 'SET_CARD_UNBLOCK_OUTCOME':
      return {
        ...state,
        isSubmitting: false,
        outcome: action.data,
      };

    case 'SET_CARD_UNBLOCK_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    default:
      return state;
  }
};

export default cardUnblockReducer;
