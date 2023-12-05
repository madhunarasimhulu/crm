import { makeSessionStorageMock } from '../utils/Jest/browseStorageMock';
import { jestLogin } from '../utils/Jest/jestLogin';
import configureStore from '../store/index';
import getTimelineEvents from './getTimelineEvents';

describe('Get Timeline Events', () => {
  let credentials = null;

  beforeAll(async () => {
    await makeSessionStorageMock();
    // Logging in to get token and tenant
    credentials = await jestLogin();
  });

  it('Should be able to successfully when get timeline', async () => {
    let store = configureStore();

    await store.dispatch(
      getTimelineEvents({
        pages: 1,
        credentials,
        accountId: 100283280,
        isPrepaid: false,
        shouldStartLoading: false,
        isCustomer: true,
      }),
    );

    const item = store.getState().timeline.items[0];

    expect(item).toMatchObject({
      account_id: expect.any(Number),
      category: expect.any(String),
      correlation_id: expect.any(String),
      data: {
        item: expect.any(Object),
        value: expect.any(String),
      },
      tenant_account_timestamp: expect.any(String),
      timestamp: expect.any(String),
      type: expect.any(String),
    });
  });
});
