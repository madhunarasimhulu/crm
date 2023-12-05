import withCache from 'axios-cache-plugin';
import { logNewWorkError } from '../utils/Error/LogNetWorkError';

const setup = (client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      logNewWorkError(error.response);
      throw error;
    },
  );

  const clientWithCache = withCache(client, {
    ttl: 5 * (60 * 1000),
    maxCacheSize: 30,
  });

  clientWithCache.__addFilter(/.*/);
  return clientWithCache;
};

const clearClientCache = (client) => client && client.__cacher.cacheMap.clear();

const clearCacheMiddleware = (client) => (response) => {
  clearClientCache(client);
  return response;
};

export { clearClientCache, clearCacheMiddleware };
export default setup;
