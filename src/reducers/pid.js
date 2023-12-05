import get from 'lodash.get';
import appInitialState from '../store/initialState';

const { pid: initialState } = appInitialState;

export const pid = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_PID':
      return {
        ...state,
        token: get(action, 'data.token'),
        questions: get(action, 'data.questions', []).sort(
          (a = {}, b = {}) =>
            a.identifier.charCodeAt(0) - b.identifier.charCodeAt(0),
        ),
        isLoading: false,
      };

    case 'SET_PID_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'RESET_PID':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
