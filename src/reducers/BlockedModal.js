import appInitialState from 'store/initialState';

const { accessDeniedModal: initialState } = appInitialState;

const BlockedModalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SHOW_BLOCKED_MODAL':
      return {
        ...state,
        showBlockedPopUp: action.data,
      };

    case 'SHOW_BLOCKED_MODAL_LOADING':
      return {
        ...state,
        showModalLoading: action.data,
      };

    default:
      return state;
  }
};

export default BlockedModalReducer;
