import { createHashHistory } from 'history';
import qs from 'query-string';
import isNil from 'lodash.isnil';

/**
 * # TODO:
 * use `search` property of location instead of `hash`
 * and `createHistory` instead of `createHashHistory`
 * (when we switch from HashRouter)
 */
const history = createHashHistory();
const { location } = window;
const targetURLPart = 'hash';

class LocationSearch {
  static get query() {
    return history.location.search || '';
  }

  static set query(nextQuery = {}) {
    const nextQueryString = qs.stringify(this.cleanSearchObject(nextQuery));

    const basePath = location[targetURLPart].split('?')[0];

    location[targetURLPart] =
      basePath +
      (nextQueryString && nextQueryString.length > 0
        ? `?${nextQueryString}`
        : '');
  }

  static get parsed() {
    return this.cleanSearchObject(qs.parse(this.query));
  }

  static cleanSearchObject(obj = {}) {
    const original = { ...obj };
    const result = [];

    for (const key in original) {
      const value = original[key];

      /* Reject nil values */
      if (isNil(value)) {
        continue;
      }

      /* Trim strings and reject empty ones */
      if (typeof value === 'string') {
        const trimmed = value.trim();

        if (!trimmed.length) {
          continue;
        }

        result[key] = trimmed;
        continue;
      }

      result[key] = value;
    }

    return result;
  }

  static update(props = {}) {
    const currentSearch = this.parsed;

    const nextSearch = {
      ...currentSearch,
      ...props,
    };

    this.query = nextSearch;
  }

  static clear() {
    this.query = '';
  }
}

export default LocationSearch;
