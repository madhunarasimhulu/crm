const FIVE_MINUTES = 5 * (60 * 1000);

class CacheMap {
  constructor(ttl = FIVE_MINUTES) {
    this.store = {};
    this.isValid = true;
    this.timeout = null;
    this.ttl = ttl;
    this.init();
  }

  init = () => {
    this.timeout = window.setTimeout(() => {
      this.isValid = false;
      this.store = {};
      this.init();
    }, this.ttl);
  };

  keep = (customerId, value) => {
    this.store[customerId] = { value, isCached: true };
  };

  retrieve = (customerId) => this.store[customerId];
}

export default CacheMap;
