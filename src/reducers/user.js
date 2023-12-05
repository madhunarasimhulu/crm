import appInitialState from '../store/initialState';

const { user: initialState } = appInitialState;

const userReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...initialState,
        ...action.data,
      };

    case 'SET_CUSTOMER_AVATAR':
      const { isCustomer } = state;

      if (!isCustomer) {
        return state;
      }

      return {
        ...state,
        avatar: action.data,
      };

    default:
      return state;
  }
};

export default userReducer;
