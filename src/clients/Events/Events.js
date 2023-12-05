import axios from 'axios';
import isNil from 'lodash.isnil';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBaseAPIURL,
  mountPismoAuthHeaders,
  getObjectsIntersectionsShallow,
  objectToArrayShallow,
} from '../../utils';
// import callEventsMock from '../../mock/call_events.json'
// import timelineMock from '../../mock/timeline_adjust_2.json'

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/events`,
  }),
);

class Events {
  static getCallHistory(
    customerId,
    accountId,
    pagination = {},
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/customers/${customerId}/accounts/${accountId}/protocols`, {
          headers: mountPismoAuthHeaders(credentials),
          params: {
            page: 1,
            perPage: 25,
            ...pagination,
          },
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static getCallEvents(
    customerId,
    accountId,
    protocol,
    credentials = {},
    isCustomer,
  ) {
    return new Promise((resolve, reject) => {
      client
        .get(
          `/v1/customers/${customerId}/accounts/${accountId}/protocols/${protocol}`,
          {
            headers: mountPismoAuthHeaders(credentials),
            params: {
              scope: isCustomer ? null : 'attendant',
            },
          },
        )
        .then((res) => res.data)
        // .then(() => callEventsMock)
        .then((events) =>
          events
            .map((event) => {
              const { additional_info } = event;
              const { text } = additional_info;
              const [oldIntersection, newIntersection] =
                getObjectsIntersectionsShallow(
                  additional_info.old,
                  additional_info.new,
                );

              const transformedOld = objectToArrayShallow(oldIntersection);
              const transformedNew = objectToArrayShallow(newIntersection);

              if (
                !transformedOld.length &&
                !transformedNew.length &&
                (!text || !text.length)
              ) {
                return null;
              }

              return {
                ...event,
                additional_info: {
                  ...additional_info,
                  transformedOld,
                  transformedNew,
                },
              };
            })
            .filter((event) => !isNil(event)),
        )
        .then(resolve)
        .catch(reject);
    });
  }

  // Return events to logged account holder
  static getTimelineEvents(page = 1, credentials = {}) {
    const endpoint = `/v1/timeline?page=${page}&perPage=20`;

    return new Promise((resolve, reject) => {
      client
        .get(endpoint, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client))
        .then((res) => res.data)
        // .then(resolve(timeline[page - 1]))
        .then(resolve)
        .catch(reject);
    });
  }

  static getTimelineEventsByAccountId(
    page,
    credentials = {},
    accountId,
    rangeDates = {},
  ) {
    const endpoint = `/v1/accounts/${accountId}/timeline?page=${page}&perPage=20`;

    return new Promise((resolve, reject) => {
      client
        .get(endpoint, {
          headers: mountPismoAuthHeaders(credentials),
          params: {
            ...rangeDates,
          },
        })
        .then(clearCacheMiddleware(client))
        .then((res) => res.data)
        // .then(resolve(timeline[page - 1]))
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default Events;
