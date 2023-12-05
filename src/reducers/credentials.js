import appInitialState from '../store/initialState';

const { credentials: initialState } = appInitialState;

const credentialsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_USER':
      const user = action.data || {};

      const {
        email = initialState.email,
        token = initialState.token,
        tenant = initialState.tenant,
        roles = initialState.roles,
        jwt = initialState.jwt,
        status = initialState.status,
      } = user;

      return {
        ...state,
        email,
        token,
        tenant,
        roles,
        jwt,
        status,
      };

    case 'SET_CUSTOMER_PROTOCOL':
      const call = action.data;
      const { protocol } = call;

      return {
        ...state,
        protocol,
      };

    case 'CLOSE_CUSTOMER_PROTOCOL':
      return {
        ...state,
        protocol: initialState.protocol,
      };

    default:
      return state;
  }
};

export default credentialsReducer;
