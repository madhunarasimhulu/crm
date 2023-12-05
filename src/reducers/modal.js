import appInitialState from '../store/initialState';

const { modal: initialState } = appInitialState;

const modalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpen: true,
        idOpen: action.value || 0,
      };

    case 'CLOSE_MODAL':
      return {
        ...initialState,
        isOpen: false,
        isSubmitting: false,
        outcome: null,
        idOpen: 0,
      };

    case 'SET_MODAL_OUTCOME':
      return {
        ...state,
        isSubmitting: false,
        outcome: action.data,
      };

    case 'SET_MODAL_SUBMITTING':
      return {
        ...state,
        isSubmitting: true,
      };

    default:
      return state;
  }
};

export default modalReducer;
