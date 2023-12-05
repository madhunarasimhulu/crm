const commonRoles = ['owner'];
const operatorRole = 'crm-operator';
const itinivel1Role = 'itinivel1-operator';
const holderRole = 'account-holder';
const operatorRoles = commonRoles.concat([operatorRole, itinivel1Role]);
const holderRoles = commonRoles.concat([holderRole]);
const allRoles = commonRoles.concat([operatorRole, itinivel1Role, holderRole]);

const routes = {
  root: {
    path: '/search',
    roles: operatorRoles,
  },
  mobileSummary: {
    path: '/customers/:customerId/accounts/:accountId/summary',
    roles: allRoles,
  },
  customer: {
    path: '/customers/:customerId/accounts/:accountId',
    roles: allRoles,
  },
  customerStatement: {
    path: '/customers/:customerId/accounts/:accountId/statements/:statementId',
    roles: allRoles,
  },
  customerStatementTransaction: {
    path: '/customers/:customerId/accounts/:accountId/statements/:statementId/transactions/:transactionId',
    roles: allRoles,
  },
  customerStatementTransactionDispute: {
    path: '/customers/:customerId/accounts/:accountId/statements/:statementId/transactions/:transactionId/dispute',
    roles: allRoles,
  },
  customerStatementTransactionDisputeStep: {
    path: '/customers/:customerId/accounts/:accountId/statements/:statementId/transactions/:transactionId/dispute/:disputeType/:disputeStep',
    roles: allRoles,
  },
  customerDebit: {
    path: '/customers/:customerId/accounts/:accountId/debit',
    roles: allRoles,
  },
  customerTransactionDebit: {
    path: '/customers/:customerId/accounts/:accountId/debit/transactions/:transactionId',
    roles: allRoles,
  },
  customerPersonalInfo: {
    path: '/customers/:customerId/profile/personal-info',
    roles: allRoles,
  },
  profileParams: {
    path: '/customers/:customerId/accounts/:accountId/profile',
    roles: allRoles,
  },
  profileParamsView: {
    path: '/customers/:customerId/accounts/:accountId/profile/:subview',
    roles: allRoles,
  },
  newCard: {
    path: '/customers/:customerId/accounts/:accountId/profile/cards/new',
    roles: holderRoles,
  },
  card: {
    path: '/customers/:customerId/accounts/:accountId/profile/cards/:cardId',
    roles: allRoles,
  },
  serviceRequests: {
    path: '/customers/:customerId/accounts/:accountId/serviceRequests',
    roles: allRoles,
  },
  timeline: {
    path: '/customers/:customerId/accounts/:accountId/timeline',
    roles: allRoles,
  },
  activity: {
    path: '/customers/:customerId/accounts/:accountId/activity',
    roles: operatorRoles,
  },
  activityView: {
    path: '/customers/:customerId/accounts/:accountId/activity/:activityView',
    roles: operatorRoles,
  },
  help: {
    path: '/help',
    roles: allRoles,
  },
  profile: {
    path: '/profile',
    roles: allRoles,
  },
  searchByCardNumber: {
    path: '/search-by-card-number',
    roles: commonRoles,
  },
  pid: {
    path: '/customers/:customerId/accounts/:accountId/pid',
    roles: allRoles,
  },
  login: {
    path: '/login',
    roles: allRoles,
  },
  initial: {
    path: '/',
    roles: allRoles,
  },
  passwordReset: {
    path: '/forget',
    roles: allRoles,
  },
  support: {
    path: '/customers/:customerId/accounts/:accountId/support',
    roles: allRoles,
  },
};

export default routes;
