import appInitialState from '../store/initialState';
import { LocationSearch } from '../clients';

const { customers: initialState } = appInitialState;
const displayCountIncrement = 25;

const customersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER_SEARCH':
      const term = action.value;

      LocationSearch.update({
        term,
      });

      return {
        ...state,
        search: term,
        isLoading: term.length >= 4,
      };

    case 'SET_CUSTOMER':
      return {
        ...initialState,
      };

    case 'SET_CUSTOMER_SEARCH_RESULTS':
      return {
        ...state,
        results: action.data,
        displayCount: 25,
        selectedResult: 0,
        isLoading: false,
        isFetching: false,
      };

    case 'INCREMENT_DISPLAY_COUNT':
      return {
        ...state,
        displayCount: state.displayCount + displayCountIncrement,
      };

    case 'SET_SELECTED_RESULT':
      return {
        ...state,
        selectedResult: action.index || 0,
      };

    case 'INCREMENT_SELECTED_RESULT':
      if (
        state.selectedResult + 1 >
        (state.results && state.results.length - 1)
      ) {
        return state;
      }

      return {
        ...state,
        selectedResult: state.selectedResult + 1,
      };

    case 'DECREMENT_SELECTED_RESULT':
      if (state.selectedResult - 1 < 0) {
        return state;
      }

      return {
        ...state,
        selectedResult: state.selectedResult - 1,
      };

    case 'START_CUSTOMERS_LOADING':
      return {
        ...state,
        isLoading: true,
      };

    case 'START_CUSTOMERS_FETCHING':
      return {
        ...state,
        isFetching: true,
      };

    case 'SET_ACCOUNT_CUSTOMER_LIST':
      return {
        ...state,
        customerList: action.data,
      };

    default:
      return state;
  }
};

export default customersReducer;
