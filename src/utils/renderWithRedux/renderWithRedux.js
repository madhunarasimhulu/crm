import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { IntlProvider, createIntl, createIntlCache } from 'react-intl';
import { Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from 'react-testing-library';
import IntlPolyfill from 'intl';
import reducers from '../../reducers/index';
import initialState from '../../store/initialState';
import i18n from '../../i18n';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/es';
import '@formatjs/intl-relativetimeformat/dist/locale-data/pt';
import '@formatjs/intl-relativetimeformat/polyfill';
import { getLanguage, setLanguage } from '../../actions';

const renderWithRedux = (component, state = {}, lang = 'pt', mockStore) => {
  // Test enviroment run as server enviroment and should have polyfill to locale
  // https://formatjs.io/guides/runtime-environments/#server
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  } else {
    global.Intl = IntlPolyfill;
  }

  if (!Intl.PluralRules) {
    require('@formatjs/intl-pluralrules/polyfill');
    require('@formatjs/intl-pluralrules/dist/locale-data/en');
    require('@formatjs/intl-pluralrules/dist/locale-data/es');
    require('@formatjs/intl-pluralrules/dist/locale-data/pt');
  }

  const history = createMemoryHistory({ initialEntries: ['/'] });
  const store = mockStore
    ? configureStore([thunk])({ ...initialState, ...state })
    : createStore(
        reducers,
        { ...initialState, ...state },
        applyMiddleware(thunk),
      );
  const cache = createIntlCache();
  const locPT = createIntl({ locale: 'pt', messages: i18n.pt }, cache);
  const locEN = createIntl({ locale: 'en', messages: i18n.en }, cache);
  const locES = createIntl({ locale: 'es', messages: i18n.es }, cache);

  const locales = {
    pt: locPT,
    en: locEN,
    es: locES,
  };

  if (!mockStore) {
    store.dispatch(getLanguage());
    store.dispatch(setLanguage(lang));
  }

  const { ui } = store.getState();
  return {
    ...render(
      <Provider store={store}>
        <IntlProvider
          value={locales[ui.language || lang]}
          locale={ui.language || lang}
          messages={i18n[ui.language || lang]}
        >
          <Router history={history}>
            <Switch>{component}</Switch>
          </Router>
        </IntlProvider>
      </Provider>,
    ),
    store,
    history,
  };
};

export default renderWithRedux;
