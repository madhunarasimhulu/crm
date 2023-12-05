import appInitialState from '../store/initialState';
// import profileParameters from '../i18n/pt/profileParameters'

const { customer: initialState } = appInitialState;

const customerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return {
        ...state,
        ...action.data,
        entity: {
          ...state.entity,
          ...action.data.entity,
        },
      };

    case 'SET_CUSTOMER_DETAIL':
      return {
        ...state,
        entity: {
          ...state.entity,
          ...action.data,
        },
      };

    case 'CLOSE_CUSTOMER_PROTOCOL':
      return {
        ...initialState,
      };

    case 'SET_CUSTOMER_AVATAR_LOADING':
      return {
        ...state,
        avatar:
          state.customerId !== action.data.customerId
            ? initialState.avatar
            : state.avatar,
      };

    case 'SET_CUSTOMER_AVATAR':
      return {
        ...state,
        avatar: action.data,
      };

    case 'SET_CUSTOMER_PROGRAMS':
      const mappedPrograms = action.data.map((program) => ({
        ...program,
        isCurrent:
          program.program_id === state.program.id &&
          program.customer_id === state.customerId &&
          program.account_id === state.accountId,
      }));

      return {
        ...state,
        programs: mappedPrograms,
      };

    case 'SET_CUSTOMER_LATEST_TRANSACTIONS_LOADING':
      return {
        ...state,
        latestAuthorizations: {
          ...state.latestAuthorizations,
          isLoading: action.data,
        },
      };

    case 'SET_CUSTOMER_LATEST_TRANSACTIONS':
      return {
        ...state,
        latestAuthorizations: action.data,
        isLoading: false,
      };

    case 'SET_ACCOUNT_STATUS':
      return {
        ...state,
        account: {
          ...state.account,
          account_status: action.data,
        },
      };

    case 'SET_ACCOUNT_DUEDATES':
      return {
        ...state,
        accountStatusCustomer: {
          open_due_date: action.data.open_due_date,
          account_status_date: action.data.account_status_date,
        },
      };

    case 'SET_ACCOUNT_DETAILS':
      return {
        ...state,
        account: {
          ...state.account,
          open_due_date: action.data?.open_due_date ?? null,
          account_status: action.data?.status ?? null,
          collection_status: action.data?.collections_status ?? null,
          status_reason_id: action.data?.status_reason_id ?? null,
        },
      };

    case 'SET_CLIENT_ID':
      return {
        ...state,
        clientId: action.data,
      };

    default:
      return state;
  }
};

export default customerReducer;
