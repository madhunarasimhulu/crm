import appInitialState from '../store/initialState';

const { profileParams: initialState } = appInitialState;

const profileParamsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER_PARAMS_LOADING':
      return {
        ...state,
        paramsLoading: action.payload,
      };
    case 'SET_CUSTOMER_PARAMS':
      return {
        ...state,
        options: { ...action.payload },
      };

    case 'SET_PARAM_VIEWER':
      return {
        ...state,
        viewer: action.payload,
      };

    case 'SET_ACCOUNT_PARAMETERS':
      return {
        ...state,
        parameters: action.payload,
      };

    case 'EDITING_ACCOUNT_PARAMETER':
      return {
        ...state,
        editing: {
          id: action.payload.id || action.payload.name,
          prevValue: action.payload.value,
          nextValue: action.payload.value,
        },
      };

    case 'UPDATING_ACCOUNT_PARAMETER':
      return {
        ...state,
        editing: {
          ...state.editing,
          nextValue: action.payload.nextValue,
        },
      };

    case 'RESET_EDIT_ACCOUNT_PARAMETER':
      return {
        ...state,
        editing: {
          id: null,
          prevValue: null,
          nextValue: null,
        },
      };

    case 'SET_PARAM_MENU_FIXED':
      return {
        ...state,
        menuFixed: action.payload,
      };

    case 'SET_CUSTOMER_DUE_DATES':
      return {
        ...state,
        dueDateAvaliables: action.data.data,
      };

    case 'SET_ACCOUNT_STATUSES':
      return {
        ...state,
        statuses: action.data,
      };

    case 'SET_DISPUTE_COUNT':
      return {
        ...state,
        disputeCounts: action.data,
      };

    case 'SET_ACCOUNT_REASONS':
      return {
        ...state,
        reasons: action.data,
      };

    case 'SET_STATUS_ACCOUNT_PROFILES':
      return {
        ...state,
        accountStatusProfile: action.data,
      };

    default:
      return state;
  }
};

export default profileParamsReducer;
