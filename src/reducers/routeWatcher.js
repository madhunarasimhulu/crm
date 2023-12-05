import appInitialState from '../store/initialState';

const { routeWatcher: initialState } = appInitialState;

const routeWatcherReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_ROUTE_WATCHER':
      return action.data;

    default:
      return state;
  }
};

export default routeWatcherReducer;
