import appInitialState from '../store/initialState';

const { AccProgramTypes: initialState } = appInitialState;

const AccProgramTypes = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_ACCOUNT_PROGRAM_TYPES_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'SET_ACCOUNT_PROGRAM_TYPES':
      return {
        ...state,
        isLoading: false,
        AccountProgramTypes: action.data,
      };

    case 'SET_ACCOUNT_PROGRAM_TYPES_LIST':
      return {
        ...state,
        isLoading: false,
        AccountProgramTypesList: action.data,
      };
    case 'SET_ACCOUNT_PROGRAM_TYPES_ERROR':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default AccProgramTypes;
