import * as Clients from '.';
import { clearClientCache } from './setup';

const clearAllCache = () => {
  for (const clientName in Clients) {
    const suffix = clientName.slice(-6);
    const clientInstance = Clients[clientName];

    if (!/client/i.test(suffix) || !clientInstance) {
      continue;
    }

    clearClientCache(clientInstance);
  }
};

export default clearAllCache;
