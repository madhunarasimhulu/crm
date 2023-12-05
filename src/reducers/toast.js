import appInitialState from '../store/initialState';

const { toast: initialState } = appInitialState;

const toastReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      let toast;

      if (typeof action.data === 'string') {
        toast = {
          message: action.data,
          style: 'success',
        };
      } else {
        toast = action.data;
      }

      return {
        ...state,
        isVisible: true,
        ...toast,
      };

    case 'DISMISS_TOAST':
      return {
        ...state,
        isVisible: false,
      };

    default:
      return state;
  }
};

export default toastReducer;
