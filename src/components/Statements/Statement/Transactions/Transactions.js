import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import { MdReportProblem } from 'react-icons/md';
import { AiOutlineMinus } from 'react-icons/ai';
import './Transactions.scss';

import { CustomerAvatar, FormatMoney } from '../../..';
import { Loader } from '../../../commons';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: localStorage.getItem('clientId'),
    };
  }

  static propTypes = {
    currentPage: PropTypes.number,
    items: PropTypes.array.isRequired,
    pages: PropTypes.number,
    perPage: PropTypes.number,
    totalItems: PropTypes.number,
    isLoading: PropTypes.bool,
    selectedTransaction: PropTypes.object,
  };

  composeMerchantLocation(merchant = {}) {
    const { city, state } = merchant;
    let result = '';

    if (city && city.length) {
      result += city;
    }

    if (state && state.length) {
      if (result.length) {
        result += `, ${state}`;
      } else {
        result += state;
      }
    }

    return result;
  }

  getTransactionCustomerName(transactionCustomerId) {
    const { customer, intl } = this.props;
    const { entity, customerId, allCustomersList } = customer;
    const { items } = allCustomersList;

    // if (transactionCustomerId && transactionCustomerId === customerId) {
    //   return entity?.name;
    // }

    if (transactionCustomerId) {
      let customersInfo = items
        ?.map((item) => {
          if (
            transactionCustomerId &&
            transactionCustomerId === item.customer.id
          ) {
            return {
              name: item?.customer?.printed_name,
              customerId: item?.customer.id,
            };
          }
        })
        .filter((item) => {
          return item != undefined;
        });
      if (customersInfo != undefined) {
        if (
          transactionCustomerId &&
          transactionCustomerId === customersInfo[0]?.customerId
        ) {
          return customersInfo[0]?.name;
        }
      } else {
        return '';
      }
    }

    return intl.formatMessage({ id: 'transactions.group.general' });
  }

  render() {
    const {
      items,
      groups,
      match,
      statementId,
      isLoading,
      error,
      errorMsg,
      selectedTransaction,
      ui,
      org,
    } = this.props;
    const { isMobile } = ui;
    const { clientId } = this.state;

    const groupHeaderClasses = `
      cb w-100 pv2dot6 ph3 ph4-ns fw4 pismo-darker bg-white bb b--pismo-lighter-gray animate-all
      ${groups.length <= 1 ? 'dn' : 'db'}
    `;

    const itemClasses = 'db cb w-100 pv3 bb b--pismo-lighter-gray animate-all';
    const fieldClasses = 'dib v-mid';

    const itemAnimation = {
      entering: 'o-0 mt3',
      entered: 'o-100',
      exited: 'o-0 mt3',
      exiting: 'o-100',
    };

    if (isLoading) {
      return (
        <div className="bg-transparent pv1 f6">
          <Transition appear in timeout={50}>
            {(state) => (
              <div
                className={`pa4 f4-ns tc pismo-light-silver animate-all ${itemAnimation[state]}`}
              >
                <Loader size="small" />
              </div>
            )}
          </Transition>
        </div>
      );
    }

    if (!items.length && error) {
      return (
        <div className="bg-white pv1 f6">
          <Transition appear in timeout={10}>
            {(state) => (
              <div
                className={`pa4 f6 f5-ns tc dark-red animate-all ${itemAnimation[state]}`}
              >
                {errorMsg || <FormattedMessage id="transactions.error" />}
              </div>
            )}
          </Transition>
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="bg-white pv1 f6">
          <Transition appear in timeout={100}>
            {(state) => (
              <div
                className={`pa4 f4-ns tc pismo-light-silver animate-all ${itemAnimation[state]}`}
              >
                <FormattedMessage id="transactions.noTrasactionForDate" />
              </div>
            )}
          </Transition>
        </div>
      );
    }

    const { params } = match;
    const { customerId, accountId } = params;

    return (
      <div
        className="transactions-base"
        style={{ height: 'calc(100vh - 64px - 112px - 48px - 67px - 90px)' }}
      >
        <div className="bg-white f6 overflow-y animate-all">
          <ul className="list pa0 ma0" data-testid="ul-container">
            {groups.map((group, groupIndex) => (
              <Transition
                appear
                in
                timeout={50 * (groupIndex + 1)}
                key={groupIndex}
              >
                <li data-testid="li-container">
                  <div className={groupHeaderClasses}>
                    <div className="dib v-mid w-two-thirds f7 f6-ns">
                      <span className="dn di-ns v-mid-ns">
                        <CustomerAvatar
                          name={this.getTransactionCustomerName(
                            group.customer.id,
                          )}
                          size="32"
                          smallLabel
                        />
                      </span>
                      <span className="di dn-ns v-mid">
                        <CustomerAvatar
                          name={this.getTransactionCustomerName(
                            group.customer.id,
                          )}
                          size="24"
                          smallLabel
                        />
                      </span>

                      <span className="ml2 dib v-mid">
                        {this.getTransactionCustomerName(group.customer.id)}
                      </span>
                    </div>
                  </div>

                  <ul className="list pa0 ma0" data-testid="ul-inner-container">
                    {group.transactions.map(
                      (
                        { transaction, authorization, merchant, _isInternal },
                        index,
                      ) => {
                        const formattedAutorizationDate =
                          authorization.event_date_utc
                            ? authorization.event_date_utc
                            : null;

                        const descriptionTransaction =
                          authorization.softDescriptor ||
                          merchant?.name ||
                          authorization.type;

                        return (
                          <Transition
                            appear
                            in
                            timeout={50 * (index + 1)}
                            key={index}
                          >
                            {(state) => (
                              // <Link
                              //   to={`/customers/${customerId}/accounts/${accountId}/statements/${statementId}/transactions/${transaction.id}`}
                              //   tabIndex={0}
                              // >
                              <li
                                data-testid="li-inner-container"
                                className={`${itemClasses} ${
                                  authorization.is_credit
                                    ? clientId === 'CL_00UTKB'
                                      ? 'pismo-near-black'
                                      : 'pismo-blue'
                                    : authorization.is_disputed
                                    ? 'pismo-gray'
                                    : 'pismo-dark-blue'
                                } ${
                                  transaction.id === selectedTransaction.id
                                    ? 'white-important bg-pismo-dark-blue'
                                    : 'hover-bg-pismo-light-gray'
                                } ${itemAnimation[state]}`}
                              >
                                <div className="w-100 ph3 ph4-ns">
                                  <div
                                    className={`${fieldClasses} w-20 w-10-ns f7 f5-ns`}
                                  >
                                    <div
                                      className={`${fieldClasses} ${
                                        authorization.is_disputed && isMobile
                                          ? 'w-50'
                                          : 'w-100'
                                      } ${
                                        authorization.is_credit
                                          ? clientId === 'CL_00UTKB'
                                            ? 'pismo-light-silver'
                                            : 'pismo-blue'
                                          : authorization.is_disputed
                                          ? 'pismo-gray'
                                          : 'pismo-light-silver'
                                      } ${
                                        transaction.id ===
                                        selectedTransaction.id
                                          ? 'white-important'
                                          : ''
                                      }`}
                                    >
                                      {formattedAutorizationDate && (
                                        <FormattedDate
                                          value={formattedAutorizationDate}
                                          day="2-digit"
                                          month="short"
                                        />
                                      )}
                                    </div>
                                    {authorization.is_disputed && isMobile && (
                                      <div
                                        className={`${fieldClasses} w-50 pl1 f5 tr ${
                                          authorization.is_credit
                                            ? clientId === 'CL_00UTKB'
                                              ? 'pismo-near-black'
                                              : 'pismo-blue'
                                            : authorization.is_disputed
                                            ? 'pismo-gray'
                                            : 'pismo-light-silver'
                                        } ${
                                          transaction.id ===
                                          selectedTransaction.id
                                            ? 'white-important'
                                            : ''
                                        }`}
                                      >
                                        <MdReportProblem />
                                      </div>
                                    )}

                                    {/* <div className={`${fieldClasses} w-50 f4-ns pl3`}>
                                      <MdAttachMoney />
                                    </div> */}
                                  </div>

                                  <div
                                    className={`${fieldClasses} w-60 w-70-ns pl2`}
                                  >
                                    <div
                                      className={` pismo-light-silver`}
                                      style={{
                                        textTransform: 'capitalize',
                                      }}
                                    >
                                      {authorization?.description != null &&
                                      authorization?.description != undefined
                                        ? String(
                                            authorization?.description,
                                          ).toLocaleLowerCase()
                                        : ''}
                                    </div>

                                    <div
                                      className="f7 f5-ns fw4"
                                      data-testid="merchant-name"
                                    >
                                      {authorization.is_disputed && !isMobile && (
                                        <span className="dib v-mid bg-pismo-smoke br1 ph2 pv1 white f7 mr2 fw4 normal-ns">
                                          <FormattedMessage id="transactions.reported" />
                                        </span>
                                      )}

                                      <span className="dib v-mid">
                                        {authorization.type === 'PAGAMENTO' ? (
                                          <FormattedMessage id="transactions.credit.payment" />
                                        ) : (
                                          descriptionTransaction
                                        )}
                                        &nbsp;
                                        {!_isInternal
                                          ? authorization.installmentsLabel
                                          : ''}
                                      </span>
                                    </div>

                                    <div
                                      className={`dn db-ns f7 f6-ns fw4 ${
                                        authorization.is_credit
                                          ? clientId === 'CL_00UTKB'
                                            ? 'pismo-near-black'
                                            : 'pismo-blue'
                                          : authorization.is_disputed
                                          ? 'pismo-gray'
                                          : 'pismo-light-silver'
                                      }
                                        ${
                                          transaction.id ===
                                          selectedTransaction.id
                                            ? 'white-important'
                                            : ''
                                        }
                                        ${
                                          this.composeMerchantLocation(merchant)
                                            .length > 0
                                            ? 'mt2'
                                            : ''
                                        }
                                      `}
                                    >
                                      <span className="ttc">
                                        {this.composeMerchantLocation(merchant)}
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    className={`${fieldClasses} w-20 f7 f5-ns tr tw-whitespace-nowrap`}
                                    data-testid="amount"
                                  >
                                    {clientId === 'CL_00UTKB' ? (
                                      authorization.is_credit ? (
                                        <span>
                                          <AiOutlineMinus
                                            style={{
                                              marginTop: '-3px',
                                              color: 'black',
                                            }}
                                          />
                                        </span>
                                      ) : (
                                        ''
                                      )
                                    ) : (
                                      ''
                                    )}
                                    <span className="fw4">{org.currency} </span>

                                    <strong>
                                      <FormatMoney
                                        value={authorization.amount}
                                      />
                                    </strong>
                                  </div>
                                </div>
                              </li>
                              // </Link>
                            )}
                          </Transition>
                        );
                      },
                    )}
                  </ul>
                </li>
              </Transition>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ payment, ui, org, customer }, props) => ({
  ui,
  org,
  customer,
  ...props,
});

export default connect(mapStateToProps)(withRouter(injectIntl(Transactions)));
