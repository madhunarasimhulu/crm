import appInitialState from '../store/initialState';

const { org: initialState } = appInitialState;

const orgReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_ORG':
      return action.data;
    default:
      return state;
  }
};

export default orgReducer;
