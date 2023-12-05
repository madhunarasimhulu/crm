import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import initialState from '../store/initialState';

const mockStore = configureStore([thunk]);
export const createMockStore = (state) =>
  mockStore({ ...initialState, ...state });
