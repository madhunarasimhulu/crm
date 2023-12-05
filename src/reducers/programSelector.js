import appInitialState from '../store/initialState';

const { programSelector: initialState } = appInitialState;

const programSelectorReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TOGGLE_PROGRAM_SELECTOR':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'SET_CUSTOMER':
    case 'SET_CUSTOMER_PROGRAMS':
      return {
        ...state,
        isOpen: false,
      };

    default:
      return state;
  }
};

export default programSelectorReducer;
