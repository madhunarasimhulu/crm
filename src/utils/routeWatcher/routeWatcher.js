import { createHashHistory, createBrowserHistory } from 'history';
import urlMatch from 'url-match';
import initSubscriber from 'redux-subscriber';
import isnil from 'lodash.isnil';
import { removeIfLastOccurrence } from '..';
import clearAllCache from '../../clients/clearAllCache';

function fixPath(location) {
  const path = removeIfLastOccurrence(location.pathname, '/');
  // Adds search params to path
  return `${path}${location.search}`;
}

export default class RouteWatcher {
  constructor(routes, store, useHashHistory) {
    this.routes = routes;
    this.store = store;
    this.history = useHashHistory
      ? createHashHistory()
      : createBrowserHistory();
    this.unlisten = null;
    this.subscribe = initSubscriber(store);
    this.unsubscribe = null;
    this.userIsLogged = false;
    this.userRoles = [];

    this.matcherRules = Object.keys(this.routes).map((key) => {
      const rule = this.routes[key];

      return {
        id: key,
        matcher: urlMatch.generate(rule.path),
        acl: rule.roles,
      };
    });
  }

  matchUrl = (location) => {
    const matches = [];
    this.matcherRules.forEach((rule) => {
      const pathNameCorrected = fixPath(location);

      const params = rule.matcher.match(pathNameCorrected);
      if (params) {
        matches.push({ routeId: rule.id, routeParams: params, acl: rule.acl });
      }
    });

    if (this.userIsLogged && this.routeCallback && matches && matches[0]) {
      const { acl: routeACL = [] } = matches[0];
      const matchMatchesACL =
        routeACL.length <= 0 ||
        routeACL.some((ac) => this.userRoles.includes(ac));

      if (matchMatchesACL) {
        this.routeCallback(matches[0]);
      }
    }
  };

  start(routeCallback) {
    this.routeCallback = routeCallback;

    this.unsubscribe = this.subscribe('user', (state) => {
      const _isLogged = !isnil(state.user.token);

      if (_isLogged !== this.userIsLogged) {
        this.userIsLogged = _isLogged;
        this.userRoles = state.user.roles || [];

        // If you are logged in, it runs the match automatically, that is,
        // before running as a location change handler
        if (_isLogged === true)
          this.matchUrl.bind(this, this.history.location)();
      }
    });

    this.unlisten = this.history.listen(this.matchUrl.bind(this));
  }

  stop() {
    if (this.unlisten) this.unlisten();
    if (this.unsubscribe) this.unsubscribe();
    if (this.routeCallback && this.routeCallback.stop)
      this.routeCallback.stop();
  }

  reload = () =>
    new Promise((resolve) => {
      clearAllCache();
      this.matchUrl.bind(this, this.history.location)();

      return resolve(true);
    });
}
