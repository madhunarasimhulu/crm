import appInitialState from '../../store/initialState';

const { customerSearch: initialState } = appInitialState;

const customerSearch = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER_SEARCH_RESULT':
      return {
        ...state,
        result: action.data,
      };
    default:
      return state;
  }
};

export default customerSearch;
