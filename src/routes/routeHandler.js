import {
  isCreditProgramType,
  verifyCustomerProgramType,
  isDebitProgramType,
  openProtocolProxy,
  isPrePaidProgramType,
} from '../utils';
import { programTypes, entityTypes } from '../constants';
import { cloneDeep } from 'lodash';

import {
  getCustomerAccount,
  getAccountStatements,
  getCustomerPrograms,
  openCustomerProtocol,
  getStatementTransactions,
  getStatementTransaction,
  setCustomerParams,
  getCards,
  getAccountParameters,
  setCard,
  getCard,
  getCardsOnFile,
  getCardStatuses,
  setCurrentRoute,
  setCardLoading,
  setCardsLoading,
  setTransactionLoading,
  getCallHistory,
  getCustomerLatestAuthorizations,
  getCustomerDueDate,
  setCustomerDueDates,
  getTimelineEvents,
  getNextStatement,
  getLimits,
  setLimitsLoading,
  getAccountStatuses,
  getAccountReasons,
  setDisputeTreeLoading,
  getDisputeTreeDisagreement,
  getDisputeTreeServiceProblems,
  getNewCardReasons,
  resetTimelineItems,
  getCustomerDetail,
  getAccountStatusProfiles,
  getAccountDueDate,
  getSpendingLimitsOnLoad,
  setSpendingLimitsLoading,
  getAccountCustomerList,
  showToast,
  setCustomer,
} from '../actions';
import { getPid } from '../actions/getPid';
import getCustomerProfileInfo from 'actions/getCustomerProfileInfo';
import { Accounts } from 'clients';
import setCustomerParamsLoading from 'actions/setCustomerParamsLoading';
import showBlockedModalLoading from 'actions/showBlockedModalLoading';

const loopIntervalId = null;

function killIntervals() {
  return clearInterval(loopIntervalId);
}

// verify customer program type and request transactions accordly
const getTransactionsByProgramType = (
  customerProgramType,
  store,
  routeParams,
) => {
  const { dispatch } = store;
  const { namedParams } = routeParams;
  const { accountId, statementId } = namedParams;
  const { credentials } = store.getState();

  if (isCreditProgramType(customerProgramType)) {
    dispatch(getNextStatement(accountId, credentials))
      .then((data) => {
        const openDueDate = data.due_date;
        const lastestStatementId = data.id;
        return dispatch(
          getAccountStatements(
            accountId,
            statementId,
            openDueDate,
            lastestStatementId,
            credentials,
          ),
        );
      })
      .then(() => {
        const { statements } = store.getState();
        dispatch(getStatementTransactions(accountId, statements, credentials));
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          dispatch(
            showToast({
              message: err?.response?.data?.message || 'Statements Not Found',
              style: 'error',
            }),
          );
        } else {
          dispatch(
            showToast({
              message: `${err?.response?.status} Error Occured While Processing`,
              style: 'error',
            }),
          );
        }
      });
  }
};

// verify customer program type and request transactions accordly
const getTransactionsByProgramTypeForChildComponents = (
  customerProgramType,
  store,
  routeParams,
) => {
  const { dispatch } = store;
  const { namedParams } = routeParams;
  const { accountId, statementId } = namedParams;
  const { credentials } = store.getState();

  if (isCreditProgramType(customerProgramType)) {
    dispatch(getNextStatement(accountId, credentials))
      .then((data) => {
        const openDueDate = data.due_date;
        const lastestStatementId = data.id;
        return dispatch(
          getAccountStatements(
            accountId,
            statementId,
            openDueDate,
            lastestStatementId,
            credentials,
          ),
        );
      })
      .then(() => {
        const { statements } = store.getState();
        dispatch(getStatementTransactions(accountId, statements, credentials));
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          dispatch(
            showToast({
              message: err?.response?.data?.message || 'Statements Not Found',
              style: 'error',
            }),
          );
        } else {
          dispatch(
            showToast({
              message: `${err?.response?.status} Error Occured While Processing`,
              style: 'error',
            }),
          );
        }
      });
  }
};

const getTimelineEventsByAccountType = (
  store,
  routeParams,
  dispatch,
  isCustomer,
) => {
  // if (program !== undefined) return;
  const {
    credentials,
    customer: {
      entity: {
        type: { description: entity_type },
      },
    },
  } = store.getState();
  const { namedParams } = routeParams;
  const { accountId, customerId } = namedParams;

  dispatch(resetTimelineItems());

  if (entity_type === entityTypes.COMPANY) {
    dispatch(getCustomerDetail(customerId, accountId, credentials));
  }

  const timelineEventsParams = {
    pages: 1,
    credentials,
    isCustomer,
    accountId,
    isPrePaid: true,
    shouldStartLoading: true,
  };

  dispatch(getTimelineEvents(timelineEventsParams));
};

const getProgramsForOperator = (
  isCustomer,
  dispatch,
  customer,
  credentials,
) => {
  if (isCustomer === false) {
    dispatch(getCustomerPrograms(customer, credentials));
  }
};

const routeHandler = (store) => {
  const fn = ({ routeId, routeParams }) => {
    const { dispatch } = store;
    const { user } = store.getState();

    const { isCustomer } = user;
    const { namedParams } = routeParams;
    const {
      customerId,
      statementId,
      transactionId,
      subview,
      activityView,
      cardId,
    } = namedParams;

    let { accountId } = namedParams;
    if (accountId === undefined) {
      accountId = sessionStorage.getItem('pismo-account-id');
    }

    // Clear the loop interval when changing route
    if (loopIntervalId) killIntervals();

    const {
      call: { onCall, currentProtocol },
    } = store.getState();

    switch (routeId) {
      // /search
      case 'root': {
        dispatch(setCurrentRoute('search'));

        break;
      }

      // /searchByCardNumber
      case 'searchByCardNumber': {
        dispatch(setCurrentRoute('searchByCardNumber'));

        break;
      }

      case 'serviceRequests': {
        dispatch(setCurrentRoute('serviceRequests'));
        break;
      }
      case 'support': {
        dispatch(setCurrentRoute('support'));
        break;
      }

      // /customers/:customerId/accounts/:accountId/summary
      case 'mobileSummary': {
        dispatch(setCurrentRoute('mobileSummary'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();
          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer } = store.getState();
              const {
                program: { type_name: customerProgramType },
              } = customer;
              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );
              // Why mobileSummary need call Statements and Transactions informations???
              getTransactionsByProgramType(
                customerProgramType,
                store,
                routeParams,
              );
              getTimelineEventsByAccountType(
                store,
                routeParams,
                dispatch,
                isCustomer,
              );
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId
      // /customers/:customerId/accounts/:accountId/statements/:statementId
      case 'customer':
      case 'customerStatement': {
        dispatch(setCurrentRoute('statements'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();
          const { status } = credentials;
          if (status === 'BLOCKED') {
          } else if (status === 'CANCELLED') {
          } else {
            dispatch(showBlockedModalLoading(true));
            dispatch(getAccountDueDate(accountId, credentials));
            dispatch(
              getCustomerAccount(customerId, accountId, credentials),
            ).then(() => {
              dispatch(showBlockedModalLoading(false));
              const { customer, routeWatcher } = store.getState();
              const {
                program: { type_name: customerProgramType },
              } = customer;

              verifyCustomerProgramType(
                programTypes.CREDIT,
                customerProgramType,
                routeWatcher,
                customerId,
                accountId,
              );

              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );

              getTransactionsByProgramType(
                customerProgramType,
                store,
                routeParams,
              );
              getTimelineEventsByAccountType(
                store,
                routeParams,
                dispatch,
                isCustomer,
              );
            });
          }
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/statements/:statementId/transactions/:transactionId
      case 'customerStatementTransaction': {
        dispatch(setCurrentRoute('transaction'));
        dispatch(setTransactionLoading(true));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer, routeWatcher } = store.getState();
              const {
                account: { open_due_date: openDueDate },
                contract: { last_statement },
                program: { type_name: customerProgramType },
              } = customer;

              verifyCustomerProgramType(
                programTypes.CREDIT,
                customerProgramType,
                routeWatcher,
                customerId,
                accountId,
              );

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );
              dispatch(
                getAccountStatements(
                  accountId,
                  statementId,
                  openDueDate,
                  last_statement,
                  credentials,
                ),
              ).then(() => {
                dispatch(
                  getStatementTransaction(
                    transactionId,
                    accountId,
                    credentials,
                  ),
                );
              });
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/statements/:statementId/transactions/:transactionId/dispute
      case 'customerStatementTransactionDispute': {
        dispatch(setCurrentRoute('dispute'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer, routeWatcher } = store.getState();
              const {
                account: { open_due_date: openDueDate },
                contract: { last_statement },
                program: { type_name: customerProgramType },
              } = customer;

              verifyCustomerProgramType(
                programTypes.CREDIT,
                customerProgramType,
                routeWatcher,
                customerId,
                accountId,
              );

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );
              dispatch(
                getAccountStatements(
                  accountId,
                  statementId,
                  openDueDate,
                  last_statement,
                  credentials,
                ),
              ).then(() => {
                dispatch(
                  getStatementTransaction(
                    transactionId,
                    accountId,
                    credentials,
                  ),
                );
              });
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/statements/:statementId/transactions/:transactionId/dispute/:disputeType/:disputeStep
      case 'customerStatementTransactionDisputeStep': {
        dispatch(setDisputeTreeLoading(true));
        Promise.all([
          dispatch(getDisputeTreeDisagreement()),
          dispatch(getDisputeTreeServiceProblems()),
        ]).then(() => dispatch(setDisputeTreeLoading(false)));
        dispatch(setCurrentRoute('dispute'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer, routeWatcher } = store.getState();
              const {
                account: { open_due_date: openDueDate },
                contract: { last_statement },
                program: { type_name: customerProgramType },
              } = customer;

              verifyCustomerProgramType(
                programTypes.CREDIT,
                customerProgramType,
                routeWatcher,
                customerId,
                accountId,
              );

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );
              dispatch(
                getAccountStatements(
                  accountId,
                  statementId,
                  openDueDate,
                  last_statement,
                  credentials,
                ),
              ).then(() => {
                dispatch(
                  getStatementTransaction(
                    transactionId,
                    accountId,
                    credentials,
                  ),
                );
              });
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/pid
      case 'pid': {
        dispatch(setCurrentRoute('pid'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer, routeWatcher } = store.getState();
              const {
                program: { type_name: customerProgramType },
              } = customer;

              verifyCustomerProgramType(
                programTypes.CHECKING_ACCOUNT,
                customerProgramType,
                routeWatcher,
                customerId,
                accountId,
              );
              dispatch(getPid({ credentials }));
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/profile
      case 'profileParams': {
        dispatch(setCurrentRoute('profileParams'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();
          dispatch(setCustomerParamsLoading(true));

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            (data) => {
              const { credit_limits, contract, account } = data;
              const { customer } = store.getState();
              const {
                program: { id: programId, type_name: customerProgramType },
              } = customer;

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );

              dispatch(
                setCustomerParams({
                  ...contract,
                  ...credit_limits,
                  ...account,
                }),
              );

              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );

              getTransactionsByProgramType(
                customerProgramType,
                store,
                routeParams,
              );
              dispatch(getCustomerDueDate(programId, credentials)).then(
                (data) => dispatch(setCustomerDueDates({ ...data })),
              );
              Accounts.getAccountLimits(customer?.accountId, credentials)
                .then((response) => {
                  let newCustomer = cloneDeep(customer);
                  newCustomer['credit_limits']['available'] =
                    response?.available_credit_limit;
                  newCustomer['credit_limits']['total'] =
                    response?.total_credit_limit;
                  newCustomer['limits'] = response;
                  let newCreditLimits = cloneDeep(newCustomer['credit_limits']);
                  dispatch(setCustomer({ ...newCustomer }));
                  dispatch(
                    setCustomerParams({
                      ...contract,
                      ...newCreditLimits,
                      ...account,
                    }),
                  );
                  dispatch(setCustomerParamsLoading(false));
                })
                .catch((e) => {
                  dispatch(
                    showToast({
                      message: `Error retrieving Account limits`,
                      style: 'error',
                    }),
                  );
                });

              getTimelineEventsByAccountType(
                store,
                routeParams,
                dispatch,
                isCustomer,
              );
            },
          );

          dispatch(getAccountParameters(accountId, credentials));
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/profile
      // /customers/:customerId/accounts/:accountId/profile/:subview
      case 'profileParamsView': {
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          dispatch(setSpendingLimitsLoading(true));
          const { credentials, customer } = store.getState();
          const program = customer?.program?.type_name;
          dispatch(setSpendingLimitsLoading(true));

          dispatch(getAccountStatusProfiles(accountId, credentials, program));

          dispatch(getCustomerAccount(customerId, accountId, credentials))
            .then((data) => {
              const { credit_limits, contract, account } = data;
              const { customer } = store.getState();
              const {
                program: { type_name: customerProgramType },
              } = customer;

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              dispatch(
                setCustomerParams({
                  ...contract,
                  ...credit_limits,
                  ...account,
                }),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );

              getTimelineEventsByAccountType(
                store,
                routeParams,
                dispatch,
                isCustomer,
              );

              // getTransactionsByProgramType(
              //   customerProgramType,
              //   store,
              //   routeParams,
              // );

              return customerProgramType;
            })
            .then((customerProgramType) => {
              const { customer } = store.getState();

              switch (subview) {
                case 'cards':
                  dispatch(setCurrentRoute('cards'));
                  dispatch(setCardsLoading(true));
                  if (
                    isCreditProgramType(customerProgramType) ||
                    isDebitProgramType(customerProgramType) ||
                    isPrePaidProgramType(customerProgramType)
                  ) {
                    const { customer, user, credentials } = store.getState();
                    dispatch(
                      getAccountCustomerList(
                        accountId,
                        credentials,
                        user,
                        customer,
                      ),
                    );
                  } else {
                    dispatch(getCardsOnFile(accountId, credentials));
                  }

                  break;

                case 'change-status':
                  const { account } = customer;

                  dispatch(setCurrentRoute('profileParams'));

                  dispatch(getAccountStatuses(credentials));
                  dispatch(
                    getAccountReasons(account.account_status_id, credentials),
                  );

                  break;

                case 'limits':
                  dispatch(setCurrentRoute('profileParams'));
                  dispatch(
                    getCustomerAccount(customerId, accountId, credentials),
                  ).then((customer) => {
                    dispatch(setLimitsLoading());
                    dispatch(
                      getLimits({ accountId: customer.accountId }, credentials),
                    );
                  });

                  break;

                case 'info':
                  dispatch(setCurrentRoute('profileParams'));
                  dispatch(
                    getCustomerProfileInfo(
                      customerId,
                      accountId,
                      credentials,
                      customer,
                    ),
                  );
                  break;
                case 'spending-limits':
                  dispatch(setCurrentRoute('profileParams'));
                  dispatch(setSpendingLimitsLoading(true));

                  dispatch(getSpendingLimitsOnLoad(credentials, accountId));
                  // .then(() => {
                  //   dispatch(setSpendingLimitsLoading(false));
                  // });
                  // .catch((error) => {
                  //   if (error?.response?.status === 404) {
                  //     dispatch(
                  //       showToast({
                  //         message: `Spending Limits Not Found `,
                  //         style: 'error',
                  //       }),
                  //     );
                  //     window.location.replace(
                  //       `#/customers/${customerId}/accounts/${accountId}`,
                  //     );
                  //   } else {
                  //     dispatch(
                  //       showToast({
                  //         message: `Error retrieving spending limits data please try again `,
                  //         style: 'error',
                  //       }),
                  //     );
                  //     // window.location.replace(
                  //     //   `#/customers/${customerId}/accounts/${accountId}`,
                  //     // );
                  //   }
                  //   dispatch(setSpendingLimitsLoading(false));
                  // });
                  break;

                default:
                  dispatch(setCurrentRoute('profileParams'));

                  break;
              }
            });
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/profile/cards/new
      case 'newCard': {
        dispatch(setCurrentRoute('cards'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer } = store.getState();

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/profile/cards/:cardId
      case 'card': {
        dispatch(setCurrentRoute('cards'));
        dispatch(setCardLoading(true));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer } = store.getState();
              const {
                program: { type_name: customerProgramType },
              } = customer;

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );

              if (
                isCreditProgramType(customerProgramType) ||
                isDebitProgramType(customerProgramType) ||
                isPrePaidProgramType(customerProgramType)
              ) {
                dispatch(getCard(cardId, credentials, isCustomer));
                dispatch(getNewCardReasons({ credentials }));
                dispatch(getCardStatuses(credentials));
              } else {
                dispatch(getCardsOnFile(accountId, credentials)).then(
                  ({ data: cards }) => {
                    const card = cards.groups
                      .map((group) => group.cards)
                      .reduce((a, b) => a.concat(b), [])
                      .find((card) => card.id === cardId);

                    dispatch(setCard(card));
                  },
                );
              }
            },
          );
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/activity
      case 'activity':
      case 'activityView': {
        dispatch(setCurrentRoute('activity'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer } = store.getState();

              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              dispatch(getCustomerPrograms(customer, credentials));
              getTimelineEventsByAccountType(
                store,
                routeParams,
                dispatch,
                isCustomer,
              );
            },
          );

          switch (activityView) {
            case 'calls':
            default:
              const { callHistory } = store.getState();
              const pagination = {};

              if (!callHistory.items.length) {
                dispatch(
                  getCallHistory(
                    customerId,
                    accountId,
                    pagination,
                    credentials,
                  ),
                );
              }

              break;
          }
        });

        break;
      }

      // /customers/:customerId/accounts/:accountId/debit
      // /customers/:customerId/accounts/:accountId/debit/transactions/:transactionId
      case 'customerDebit': {
        dispatch(setCurrentRoute('debit'));
        openProtocolProxy(
          onCall,
          currentProtocol,
          customerId,
          accountId,
          user,
          dispatch,
          openCustomerProtocol,
        ).then(() => {
          const { credentials } = store.getState();

          dispatch(getAccountDueDate(accountId, credentials));
          dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
            () => {
              const { customer, routeWatcher } = store.getState();
              const {
                program: { type_name: customerProgramType },
              } = customer;

              verifyCustomerProgramType(
                programTypes.CHECKING_ACCOUNT, // or programTypes.PRE_PAID
                customerProgramType,
                routeWatcher,
                customerId,
                accountId,
              );
              // if (isPrePaidProgramType(customerProgramType)) dispatch(resetPrePaidTimelineItems())
              // dispatch(resetTimelineItems())
              dispatch(
                getCustomerLatestAuthorizations(customerId, credentials),
              );
              getProgramsForOperator(
                isCustomer,
                dispatch,
                customer,
                credentials,
              );
              getTransactionsByProgramType(
                customerProgramType,
                store,
                routeParams,
              );

              getTimelineEventsByAccountType(
                store,
                routeParams,
                dispatch,
                isCustomer,
                true,
              );
            },
          );
        });

        break;
      }

      // /help
      case 'help': {
        dispatch(setCurrentRoute('help'));

        break;
      }

      // /profile
      case 'profile': {
        dispatch(setCurrentRoute('profile'));

        break;
      }

      case 'passwordReset': {
        dispatch(setCurrentRoute('forget'));

        break;
      }

      case 'login': {
        dispatch(setCurrentRoute('login'));

        break;
      }

      default: {
        break;
      }
    }
  };

  fn.stop = () => killIntervals();

  return fn;
};

export default routeHandler;
