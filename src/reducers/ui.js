import appInitialState from '../store/initialState';
import { supportedLanguages } from '../constants';

const { ui: initialState } = appInitialState;

const uiReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      let language = action.data.substr(0, 2);

      if (!supportedLanguages.includes(language)) {
        language = supportedLanguages[0];
      }

      window.localStorage.setItem('ui.language', language);

      return {
        ...state,
        language,
      };

    case 'SET_CURRENT_ROUTE':
      return {
        ...state,
        currentRoute: action.data,
      };

    case 'SET_MOBILE_DETECTION':
      return {
        ...state,
        isMobile: action.data,
      };

    case 'SET_INITIAL_DIMENSIONS':
      return {
        ...state,
        initialDimensions: action.data,
        currentDimensions: action.data,
      };

    case 'SET_CURRENT_DIMENSIONS':
      const initialHeight = state.initialDimensions.height || 0;
      const currentHeight = action.data.height;

      return {
        ...state,
        currentDimensions: action.data,
        isMobileKeyboardVisible:
          state.isMobile && currentHeight < initialHeight,
      };

    default:
      return state;
  }
};

export default uiReducer;
