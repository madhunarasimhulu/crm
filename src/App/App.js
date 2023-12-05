import React, { Component } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../store';
import {
  getIsAccountEnvVar,
  predictMobile,
  importAsyncBuild,
  isDebitProgramType,
} from '../utils';
import { routes, routeHandler } from '../routes';
import i18n from '../i18n';
import {
  RouteWatcherLayer,
  AppBar,
  AttendanceNotes,
  PaymentModal,
  AccountBlockedModal,
} from '../components';
import { Toast } from '../components/commons';

import { DebitProvider } from '../pages/DebitPaid';

import {
  updateUser,
  getLanguage,
  setMobileDetection,
  setInitialDimensions,
  setCurrentDimensions,
  setRouteWatcher,
  getOrgInfo,
  openAccountBlockedModal,
} from '../actions';

import '@pismo/bolt/dist/css/bolt-css.css';
import './reset.css';
import 'normalize.css';
import 'tachyons';
import './App.scss';
import 'currency-flags/dist/currency-flags.min.css';
import '@aws-amplify/ui-react/styles.css';
import BrandProvider from './BrandProvider';

import HomePage from '../pages/Home';
import CustomerPage from '../pages/Customer';
import MobileSummary from '../pages/MobileSummary';
import AppAuth from './AppAuth';
import { CustomerOnBoard } from 'pages/CustomerOnboard';
import CustomerSearch from 'pages/CustomerSearch/CustomerSearch';
import RealtimeMap from 'pages/coral/RealtimeMap';
import Nav from 'pages/CustomerSearch/Nav';
import Timeline from 'pages/Timeline/Timeline';

const importAsync = importAsyncBuild({
  autoPreload: true,
  autoPreloadDelay: 3000,
  loaderDisplayDelay: 250,
});

const TransactionPage = importAsync(() => import('../pages/Transaction'));
const DisputePage = importAsync(() => import('../pages/Dispute'));
const DebitPaidPage = importAsync(() => import('../pages/DebitPaid'));
const DebitTransaction = importAsync(() =>
  import('../pages/DebitPaid/DebitTransaction'),
);
const ProfileParams = importAsync(() => import('../pages/ProfileParams'));
const NewCardPage = importAsync(() => import('../pages/NewCard'));
const CardPage = importAsync(() => import('../pages/Card'));
const ActivityPage = importAsync(() => import('../pages/Activity'));
const HelpPage = importAsync(() => import('../pages/Help'));
const UserProfilePage = importAsync(() => import('../pages/UserProfile'));
const SearchByCardNumberPage = importAsync(() =>
  import('../pages/SearchByCardNumber'),
);
const customerServiceDetails = importAsync(() =>
  import('../pages/CustomerServiceDetails/customerServiceDetails'),
);
const PidPage = importAsync(() => import('../pages/Pid'));
// const LoginPage = importAsync(() => import('../pages/Login'));
const SplashPage = importAsync(() => import('../pages/Splash'));
const ServiceRequests = importAsync(() => import('../pages/ServiceRequests'));

const store = configureStore();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: true,
    };
  }
  handleWatcherUpdate = (routeWatcher) => {
    this.props.dispatch(setRouteWatcher(routeWatcher));
  };

  handleUserChanged = (user) => {
    if (typeof user?.token === 'undefined') return;

    const { dispatch } = this.props;

    dispatch(updateUser(user));
    dispatch(getOrgInfo());
  };

  handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.props.dispatch(setMobileDetection(predictMobile()));
    this.props.dispatch(setCurrentDimensions({ width, height }));
  };

  setInitialDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.props.dispatch(
      setInitialDimensions({
        width,
        height,
      }),
    );
  };

  getUserCustomerPath = () => {
    const { user } = this.props;
    const { accounts = [] } = user;

    const firstAccount = accounts[0] || {};
    const { customer: customerId, account: accountId } = firstAccount;

    if (!customerId || !accountId) {
      return '/';
    }

    return `/customers/${customerId}/accounts/${accountId}`;
  };

  isDebitProgram = () => {
    const { customer } = this.props;

    const {
      program: { type_name: customerProgramType },
    } = customer;

    return isDebitProgramType(customerProgramType);
  };

  handleIfInvalidUser = () => {
    const { user, pismoAuth } = this.props;
    const { isCustomer, roles } = user;
    const isAccount = getIsAccountEnvVar();

    if (user?.token) {
      this.setState({ isLogin: false });
    }

    const userHasActiveSession = user && user.token && user.token.length > 0;
    const inAccountButNotCustomer = isAccount && !isCustomer;
    const inCrmButNotAttendant = !isAccount && isCustomer;
    const isCustomerButMissingRoles =
      isCustomer && !roles.includes('account-holder');
    const isAttendantButMissingRoles =
      !isCustomer && !roles.includes('crm-operator');

    if (
      userHasActiveSession &&
      (inAccountButNotCustomer ||
        inCrmButNotAttendant ||
        isCustomerButMissingRoles ||
        isAttendantButMissingRoles)
    ) {
      pismoAuth && pismoAuth.logout && pismoAuth.logout();
    }
  };

  componentDidMount() {
    this.handleResize();
    this.setInitialDimensions();

    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps) {
    const {
      user: prevUser,
      customer: {
        account: {
          status_reason_id: prev_status_reason_id,
          account_status: prev_account_status,
        },
      },
    } = prevProps;
    const {
      user,
      customer: {
        account: { status_reason_id, account_status },
      },
    } = this.props;

    if (user.isCustomer !== prevUser.isCustomer) {
      // this.handleIfInvalidUser();
    }
    if (
      prev_status_reason_id !== status_reason_id &&
      prev_account_status !== account_status &&
      account_status === 'BLOCKED' &&
      status_reason_id ===
        Number(process.env.REACT_APP_MAX_OTP_ATTEMPT_STATUS_REASON_ID)
    ) {
      this.props.dispatch(openAccountBlockedModal());
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { ui, user, BlockedModal } = this.props;
    const { isCustomer, token } = user;
    const { language } = ui;
    const { showBlockedPopUp } = BlockedModal;

    const isAccount = getIsAccountEnvVar();
    const rootRoute = isAccount ? this.getUserCustomerPath() : routes.root.path;

    const redirectToDebit =
      this.isDebitProgram() && token && isCustomer && rootRoute !== '/';

    return (
      <IntlProvider locale={language} messages={i18n[language]}>
        <RouteWatcherLayer
          routes={routes}
          handler={routeHandler}
          store={store}
          onUpdate={this.handleWatcherUpdate}
        >
          <BrandProvider>
            <div className="App__Inner">
              {/* {!isCustomer && <AttendanceNotes />} */}
              <Router>
                <Nav />

                <Route
                  exact
                  path={[routes.initial.path]}
                  component={CustomerSearch}
                />
                <AppAuth onUpdate={this.handleUserChanged}>
                  <DebitProvider>
                    <div>
                      {/* {this.state.isLogin && <LoginPage />} */}
                      <div
                        style={{ display: showBlockedPopUp ? 'none' : 'block' }}
                      >
                        <AccountBlockedModal />
                        <PaymentModal />
                        <Switch>
                          {redirectToDebit && (
                            <Redirect
                              exact
                              from={rootRoute}
                              to={`${rootRoute}/debit`}
                            />
                          )}
                          {!isAccount && (
                            <Route
                              exact
                              path={routes.root.path}
                              component={HomePage}
                            />
                          )}
                          {!isAccount && (
                            <Route
                              exact
                              path={routes.pid.path}
                              component={PidPage}
                            />
                          )}
                          {!isAccount && (
                            <Route
                              exact
                              path={[
                                routes.activity.path,
                                routes.activityView.path,
                              ]}
                              component={ActivityPage}
                            />
                          )}
                          <Route
                            exact
                            path={'/customer-onboard'}
                            component={CustomerOnBoard}
                          />
                          <Route
                            exact
                            path={routes.mobileSummary.path}
                            component={MobileSummary}
                          />
                          <Route
                            exact
                            path={routes.customerStatementTransaction.path}
                            component={TransactionPage}
                          />
                          <Route
                            exact
                            path={[
                              routes.customer.path,
                              routes.customerStatement.path,
                            ]}
                            component={CustomerPage}
                          />
                          <Route
                            exact
                            path={[
                              routes.profileParams.path,
                              routes.profileParamsView.path,
                            ]}
                            component={ProfileParams}
                          />
                          <Route
                            exact
                            path={routes.newCard.path}
                            component={NewCardPage}
                          />
                          <Route
                            exact
                            path={routes.card.path}
                            component={CardPage}
                          />
                          <Route
                            exact
                            path={routes.serviceRequests.path}
                            component={ServiceRequests}
                          />
                          <Route
                            exact
                            path={routes.timeline.path}
                            component={Timeline}
                          />
                          <Route
                            exact
                            path={routes.help.path}
                            component={HelpPage}
                          />
                          <Route
                            exact
                            path={routes.profile.path}
                            component={UserProfilePage}
                          />
                          <Route
                            exact
                            path={routes.searchByCardNumber.path}
                            component={SearchByCardNumberPage}
                          />
                          <Route
                            exact
                            path={[
                              routes.customerStatementTransactionDispute.path,
                              routes.customerStatementTransactionDisputeStep
                                .path,
                            ]}
                            component={DisputePage}
                          />
                          <Route
                            exact
                            path={[routes.customerDebit.path]}
                            component={DebitPaidPage}
                          />
                          <Route
                            exact
                            path={[routes.customerTransactionDebit.path]}
                            component={DebitTransaction}
                          />
                          <Route
                            exact
                            path={routes.support.path}
                            component={customerServiceDetails}
                          />

                          <Route
                            exact
                            path={[routes.login.path]}
                            component={SplashPage}
                          />
                          {token && <Redirect from="/" to={rootRoute} />}
                        </Switch>
                      </div>
                    </div>
                  </DebitProvider>
                </AppAuth>
              </Router>
              <Toast />
            </div>
          </BrandProvider>
        </RouteWatcherLayer>
      </IntlProvider>
    );
  }
}

store.dispatch(getLanguage());

const mapStateToProps = (state, props) => ({
  ...state,
  ...props,
});

const ConnectedApp = connect(mapStateToProps)(App);

class AppWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    );
  }
}

export default AppWrapper;
