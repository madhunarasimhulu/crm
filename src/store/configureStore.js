import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import initialState from './initialState';
import appReducer from '../reducers';

function verifyUseReduxDevtools() {
  if (
    process.env.USE_REDUX_DEVTOOLS &&
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__ !== null
  ) {
    // If you wish to use redux devtools uncomment the code bellow, but it will turn the application a bit slower
    // place it as a parameter on window.__REDUX_DEVTOOLS_EXTENSION__({serialize: true})
    // This prevent redux devtools from crashing when inpecting the state
    // https://github.com/zalmoxisus/redux-devtools-extension/issues/287
    // https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#it-fails-to-serialize-data-when-passing-synthetic-events-or-calling-an-action-directly-with-redux-actions

    return compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
  }
}

const enhancer = verifyUseReduxDevtools() || compose(applyMiddleware(thunk));

const configureStore = (preloadedState = initialState) => {
  const store = createStore(appReducer, preloadedState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
