import appInitialState from '../store/initialState';

const { cardEditParam: initialState } = appInitialState;

const cardEditParamReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_CARD_EDIT_PARAM':
      return {
        ...state,
        isOpen: true,
        param: action.data,
      };

    case 'SET_CARD_PARAM_VALUE':
      return {
        ...state,
        param: {
          ...state.param,
          value: action.data.value,
        },
      };

    case 'CLOSE_CARD_EDIT_PARAM':
    case 'RESET_CARD':
      return {
        ...initialState,
      };

    case 'SET_CARD_EDIT_PARAM_OUTCOME':
      return {
        ...state,
        isSubmitting: false,
        outcome: action.data,
      };

    case 'SET_CARD_EDIT_PARAM_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    default:
      return state;
  }
};

export default cardEditParamReducer;
