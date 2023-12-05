import appInitialState from '../store/initialState';

const { cardTemporaryBlock: initialState } = appInitialState;

const cardTemporaryBlockReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_CARD_TEMPORARY_BLOCK':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CARD_TEMPORARY_BLOCK':
    case 'RESET_CARD':
      return {
        ...initialState,
      };

    case 'SET_CARD_TEMPORARY_BLOCK_OUTCOME':
      return {
        ...state,
        isSubmitting: false,
        outcome: action.data,
      };

    case 'SET_CARD_TEMPORARY_BLOCK_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    default:
      return state;
  }
};

export default cardTemporaryBlockReducer;
