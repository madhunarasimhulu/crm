import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { MdClose } from 'react-icons/md';
import { Loader } from '../commons';
import {
  NavBar,
  CancelInvoiceInstallmentModal,
  AdvanceInvoiceInstallmentModal,
  FormatMoney,
} from '..';
import {
  resetTransaction,
  openCancelInvoiceInstallment,
  openAdvanceInvoiceInstallment,
} from '../../actions';

class TransactionDetail extends Component {
  handleCancelInvoiceInstallment = () => {
    this.props.dispatch(openCancelInvoiceInstallment());
  };

  handleAdvanceInvoiceInstallment = () => {
    this.props.dispatch(openAdvanceInvoiceInstallment());
  };

  formatCardName(authorization = {}) {
    const { card_name: cardName } = authorization;
    let result = '';

    if (cardName && cardName.toUpperCase() === 'PLASTIC') {
      return (result = this.props.intl.formatMessage({
        id: 'transactions.details.physical',
      }));
    }

    if (cardName && cardName.toUpperCase() !== 'PLASTIC') {
      // eslint-disable-next-line no-unused-vars
      return (result = `${this.props.intl.formatMessage({
        id: 'transactions.details.card',
      })}: ${cardName}`);
    }

    return null;
  }

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

  handleGoBack = () => {
    const {
      match,
      history,
      advanceInvoiceInstallment,
      cancelInvoiceInstallment,
    } = this.props;
    const { customerId, accountId, statementId } = match.params;
    const { isOpen: isOpenAdvanceInvoiceInstallment } =
      advanceInvoiceInstallment;
    const { isOpen: isOpenCancelInvoiceInstallment } = cancelInvoiceInstallment;

    if (!isOpenAdvanceInvoiceInstallment && !isOpenCancelInvoiceInstallment) {
      history.push(
        `/customers/${customerId}/accounts/${accountId}/statements/${statementId}/`,
      );
    }
  };

  handleKeyDown = (event) => {
    const { keyCode } = event;

    const callbackMap = {
      27: this.handleGoBack, // esc
    };

    const callback = callbackMap[keyCode];

    if (!callback || typeof callback !== 'function') {
      return false;
    }

    return callback();
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.props.dispatch(resetTransaction());
  }

  render() {
    const { transaction, customer, intl, match, org } = this.props;
    const { customerId, accountId } = customer;
    const { authorization, merchant, _isInternal, isLoading, error, errorMsg } =
      transaction;
    const { formatDate, formatTime } = intl;
    const { statementId } = match.params;
    const transactionId = transaction.transaction.id;
    const disputePagePath = `/customers/${customerId}/accounts/${accountId}/statements/${statementId}/transactions/${transactionId}/dispute`;

    const formattedDate = formatDate(
      authorization.event_date_utc || new Date(),
      {
        month: 'short',
        day: '2-digit',
      },
    );
    const formattedTime = formatTime(
      authorization.event_date_utc || new Date(),
      {
        hour: 'numeric',
        minute: 'numeric',
      },
    );

    const authorizationMccGroupName =
      transaction?.merchant?.category?.group_name;

    const authorizationMccDetails = authorizationMccGroupName;
    const authorizationEntryMode = authorization.entry_mode || '';
    const transactionCategory = transaction.transaction.category || '';
    const isInvoiceInstallmentParcel =
      authorization.type === 'PARCELA DE REFINANCIAMENTO';

    const containerClasses =
      'relative w-100 mw7-ns center-ns bg-pismo-lighter-gray pismo-darker-blue';

    if (isLoading) {
      return (
        <div className={containerClasses}>
          <div className="pv5 tc">
            <Loader />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={containerClasses}>
          <div className="pv5 tc dark-red">
            {errorMsg || <FormattedMessage id="transaction.error" />}
          </div>
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <div>
          <NavBar
            leftSlot={null}
            rightSlot={<MdClose />}
            rightSlotClickHandler={this.handleGoBack}
            theme="gray"
            title={`${formattedDate} • ${formattedTime}`}
          />

          <div className="tc f7 f6-ns w-100 pa2">
            {authorizationMccDetails && <span>{authorizationMccDetails}</span>}
          </div>

          <div className="pv3 pv4-ns tc">
            {authorization.is_disputed && (
              <div className="pv2">
                <span className="bg-pismo-smoke br1 ph2 pv1 white f7">
                  <FormattedMessage id="transactions.reported" />
                </span>
              </div>
            )}

            <h1 className="f2 f1-ns ma0 pa0">
              <span className="fw4">{org.currency} </span>
              <span>
                <FormatMoney value={authorization.amount} />
              </span>
            </h1>

            <h2 className="f5 f3-ns ma0 pa0 mt1">
              {authorization.soft_descriptor ||
                merchant?.name ||
                authorization.type}
              &nbsp;
              {!_isInternal ? authorization.installmentsLabel : ''}
            </h2>
          </div>

          <div className="pv2 lh-copy tc">
            <div className="f7 f6-ns w-100 pa1">
              {this.formatCardName(authorization)}
            </div>
            <div className="f7 f6-ns w-100 pa1">
              {authorizationEntryMode && (
                <FormattedMessage
                  id={`transactions.entryMode.${authorizationEntryMode}`}
                />
              )}
            </div>

            {transactionCategory && (
              <div className="f7 f6-ns w-100 pa1">
                <FormattedMessage
                  id={`transactions.category.${transactionCategory}`}
                />
              </div>
            )}

            {/* {authorization.local_currency &&
              authorization.local_currency.toUpperCase() !== 'BRL' && (
                <div className="f7 f6-ns w-100 pa2">
                  <div className="tc">
                    {formatCurrency(
                      authorization.local_amount,
                      authorization.local_currency,
                    ).format(authorization.local_currency)}{' '}
                    <span className="f7 v-mid">
                      {authorization.local_currency}
                    </span>
                    {authorization.reference_amount &&
                      authorization.local_currency.toUpperCase() !== 'BRL' &&
                      authorization.local_currency.toUpperCase() !== 'USD' && (
                        <span>
                          {' '}
                          &bull;{' '}
                          {formatCurrency(
                            authorization.reference_amount,
                            'USD',
                          ).format('USD')}{' '}
                          <span className="f7 v-mid">USD</span>
                        </span>
                      )}
                  </div>
                </div>
              )} */}

            <div className="f7 f6-ns w-100 pa2">
              <span className="ttc">
                {this.composeMerchantLocation(merchant)}
              </span>
            </div>
          </div>

          {isInvoiceInstallmentParcel && (
            <div className="dt w-100 pv3 pt4 bg-near-white">
              <div className="dtc w-50 tr pr1 pr4-ns">
                <button
                  type="button"
                  className="button-reset bn bg-transparent pointer f6 f5-ns pismo-link"
                  onClick={this.handleCancelInvoiceInstallment}
                >
                  <FormattedMessage id="transactions.cancelInvoiceInstallment" />
                </button>
                <CancelInvoiceInstallmentModal />
              </div>
              <div className="dtc w-50 tl pl1 pl4-ns">
                <button
                  type="button"
                  className="button-reset bn bg-transparent pointer f6 f5-ns pismo-link"
                  onClick={this.handleAdvanceInvoiceInstallment}
                >
                  <FormattedMessage id="transactions.advanceInvoiceInstallment" />
                </button>
                <AdvanceInvoiceInstallmentModal />
              </div>
            </div>
          )}

          {authorization.is_disputable && !authorization.is_disputed && (
            <div className="pv3 pt4 tc bg-near-white">
              <Link to={disputePagePath} className="pismo-link">
                <FormattedMessage id="transactions.reportIssue" />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  {
    credentials,
    customer,
    ui,
    advanceInvoiceInstallment,
    cancelInvoiceInstallment,
    org,
  },
  props,
) => ({
  credentials,
  customer,
  ui,
  advanceInvoiceInstallment,
  cancelInvoiceInstallment,
  org,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(TransactionDetail)),
);
