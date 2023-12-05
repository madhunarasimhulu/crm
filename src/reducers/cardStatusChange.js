import appInitialState from '../store/initialState';

const { cardStatusChange: initialState } = appInitialState;

const cardStatusChangeReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_CARD_STATUS_CHANGE':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CARD_STATUS_CHANGE':
    case 'RESET_CARD':
      return {
        ...state,
        isOpen: false,
        outcome: null,
        isSubmitting: false,
        selectedStatus: '',
      };

    case 'SET_CARD_STATUS_CHANGE_OUTCOME':
      return {
        ...state,
        isSubmitting: false,
        outcome: action.data,
      };

    case 'SET_CARD_STATUS_CHANGE_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_CARD_STATUSES':
      return {
        ...state,
        statuses: action.data,
      };

    case 'SET_CARD_SELECTED_STATUS':
      return {
        ...state,
        selectedStatus: action.data,
      };

    default:
      return state;
  }
};

export default cardStatusChangeReducer;
