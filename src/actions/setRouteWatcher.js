const type = 'SET_ROUTE_WATCHER';

const setRouteWatcher = (watcher) => ({
  type,
  data: watcher,
});

export default setRouteWatcher;
