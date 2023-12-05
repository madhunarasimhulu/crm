import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { getBasePCIAPIURL, mountPismoAuthHeaders, mapCards } from '../../utils';

const baseURL = getBasePCIAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/cardsonfile`,
  }),
);

class CardsOnFile {
  static getCardsOnFile(
    accountId,
    credentials = {},
    page = true,
    groupBy = true,
  ) {
    return client
      .get('/v2/cardsonfile/cards', {
        headers: {
          ...mountPismoAuthHeaders({
            token: credentials.token,
            tenant: credentials.tenant,
          }),
          'x-account-id': accountId,
        },
        params: page
          ? {
              page: 1,
              perPage: 999,
            }
          : {},
      })
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data)
      .then((data) => (groupBy ? mapCards(data) : data));
  }

  static deleteCardOnFile({ accountId, cardId }, credentials = {}) {
    return client
      .patch(
        '/v2/cardsonfile/cards',
        {
          card_stored_uuid: cardId,
          status: 'SUSPENDED',
        },
        {
          headers: {
            ...mountPismoAuthHeaders({
              token: credentials.token,
              tenant: credentials.tenant,
            }),
            'x-account-id': accountId,
          },
        },
      )
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data)
      .then(clearCacheMiddleware(client));
  }

  static getAccountsByCardNumber(pan, credentials = {}) {
    return client
      .get('/v1/cardsonfile/accountids', {
        headers: {
          ...mountPismoAuthHeaders({
            token: credentials.token,
            tenant: credentials.tenant,
          }),
          'x-pan': pan,
        },
      })
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data);
  }
}

export { client };
export default CardsOnFile;
