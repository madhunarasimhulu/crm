import appInitialState from '../store/initialState';

const { searchByCard: initialState } = appInitialState;

const searchByCardReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SEARCH_BY_CARD_NUMBER':
      return {
        ...state,
        search: action.value,
      };

    case 'START_CUSTOMER_BY_CARDS_FETCHING':
      return {
        ...state,
        isFetching: true,
      };

    case 'STOP_CUSTOMER_BY_CARDS_FETCHING':
      return {
        ...state,
        isFetching: false,
      };

    case 'SET_BANK_ACCOUNT_SEARCH_BY_ID_RESULTS':
      return {
        ...state,
        results: action.value,
      };

    case 'RESET_BANK_ACCOUNT_SEARCH_BY_ID_RESULTS':
      return {
        ...state,
        results: [],
      };

    default:
      return state;
  }
};

export default searchByCardReducer;
