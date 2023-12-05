import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import { MdClose } from 'react-icons/md';
import { MdDone } from 'react-icons/md';
import { Loader } from '../commons';

import {
  closeCancelInvoiceInstallment,
  getCancelInvoiceInstallment,
  confirmCancelInvoiceInstallment,
} from '../../actions';
import { FormatMoney } from '..';

class CancelInvoiceInstallmentModal extends Component {
  handleConfirmCancelInvoiceInstallment = () => {
    const {
      cancelInvoiceInstallment,
      transaction,
      customer,
      credentials,
      dispatch,
    } = this.props;
    const { isSubmitting } = cancelInvoiceInstallment;
    const {
      transaction: { id: transactionId },
    } = transaction;
    const { accountId } = customer;

    if (isSubmitting) {
      return false;
    }

    return dispatch(
      confirmCancelInvoiceInstallment(accountId, transactionId, credentials),
    );
  };

  handleClose = () => {
    const { cancelInvoiceInstallment, dispatch } = this.props;
    const { isOpen } = cancelInvoiceInstallment;

    if (!isOpen) {
      return false;
    }

    dispatch(closeCancelInvoiceInstallment());
  };

  handleKeyDown = (event) => {
    const { keyCode } = event;

    if (keyCode !== 27) {
      return false;
    }

    return this.handleClose();
  };

  componentDidUpdate(prevProps) {
    const { cancelInvoiceInstallment: prevCancelInvoiceInstallment } =
      prevProps;
    const {
      cancelInvoiceInstallment,
      customer,
      transaction,
      dispatch,
      credentials,
    } = this.props;

    const { isOpen: wasOpen } = prevCancelInvoiceInstallment;
    const { isOpen } = cancelInvoiceInstallment;
    const { accountId } = customer;
    const {
      transaction: { id: transactionId },
    } = transaction;

    if (!wasOpen && isOpen) {
      dispatch(
        getCancelInvoiceInstallment(accountId, transactionId, credentials),
      );
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // render functions for each state

  renderLoader() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="cancelInvoiceInstallment.title" />
        </div>

        <div
          className="absolute top-0 right-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleClose}
          >
            <MdClose />
          </button>
        </div>
        <div className="pv5 tc">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  renderEmptyState() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="cancelInvoiceInstallment.title" />
        </div>

        <div
          className="absolute top-0 right-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleClose}
          >
            <MdClose />
          </button>
        </div>
        <div className="pv5 w-70 center tc f4">
          <FormattedMessage id="cancelInvoiceInstallment.emptyState" />
        </div>
      </div>
    );
  }

  renderErrorState() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="cancelInvoiceInstallment.title" />
        </div>

        <div
          className="absolute top-0 right-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleClose}
          >
            <MdClose />
          </button>
        </div>
        <div className="pv5 w-70 center tc">
          <FormattedMessage id="cancelInvoiceInstallment.errorState" />
          <br />
          <br />
          <FormattedMessage id="tryAgainLater" />
        </div>
      </div>
    );
  }

  renderCancelInfo = (invoiceInstallment, buttonClasses) => {
    const {
      contract: {
        first_payment_date: firstPaymentDate,
        first_payment_amount: firstPaymentAmount,
        number_of_installments: numberInstallments,
        contract_amount: contractAmount,
        principal_amount: principalAmount,
        installment_amount: installmentAmount,
        interest_rate: interestRate,
      },
    } = invoiceInstallment;

    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="cancelInvoiceInstallment.title" />
        </div>

        <div
          className="absolute top-0 right-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleClose}
          >
            <MdClose />
          </button>
        </div>
        <div className="pv4 center w-90">
          <div className="f3 mb3 pa2 tc">
            <FormatMoney value={contractAmount} showSymbol />
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="cancelInvoiceInstallment.firstPaymentDate" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormattedDate value={firstPaymentDate} />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="cancelInvoiceInstallment.firstPaymentAmount" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormatMoney value={firstPaymentAmount} showSymbol />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="cancelInvoiceInstallment.numberInstallments" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              {numberInstallments}
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="cancelInvoiceInstallment.principalAmount" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormatMoney value={principalAmount} showSymbol />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="cancelInvoiceInstallment.installmentAmount" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormatMoney value={installmentAmount} showSymbol />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="cancelInvoiceInstallment.interestRate" />:
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">{interestRate}%</div>
          </div>
        </div>
        <div className="w-80 center pa3">
          <button
            className={buttonClasses}
            onClick={this.handleConfirmCancelInvoiceInstallment}
          >
            <FormattedMessage id="cancelInvoiceInstallment.confirm" />
          </button>
        </div>
      </div>
    );
  };

  renderOutcome = (buttonClasses) => (
    <div>
      <div className="tc fw4 lh-copy pt3 pb2">
        <FormattedMessage id="cancelInvoiceInstallment.title" />
      </div>

      <div className="absolute top-0 right-1 mt1" style={{ marginTop: '12px' }}>
        <button
          type="button"
          className="button-reset bn bg-transparent pointer f4"
          onClick={this.handleClose}
        >
          <MdClose />
        </button>
      </div>
      <div className="pv4 tc">
        <div className="f1 mb3">
          <MdDone />
        </div>

        <div className="w-70 center f6 mb4">
          <div className="mb1">
            <FormattedMessage id="cancelInvoiceInstallment.outcomeSuccess" />
          </div>
        </div>

        <div className="w-80 center mt3">
          <button className={buttonClasses} onClick={this.handleClose}>
            <FormattedMessage id="cancelInvoiceInstallment.close" />
          </button>
        </div>
      </div>
    </div>
  );

  render() {
    const { cancelInvoiceInstallment } = this.props;
    const {
      isOpen,
      isFetching,
      invoiceInstallment,
      isSubmitting,
      errorState,
      cancelConfirmed,
    } = cancelInvoiceInstallment;

    if (!isOpen) {
      return null;
    }

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw5dot5-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const commonButtonClasses =
      'button-reset db w-100 ph2 pv2dot7 br2 fw4 f7dot5 pointer';

    const buttonClasses = `${commonButtonClasses} bn bg-pismo-silver pismo-darker`;

    const fadeInStates = {
      entering: 'o-0',
      entered: 'o-100',
      exiting: 'o-100',
      exited: 'o-0',
    };

    const growStates = {
      entering: 0.2,
      entered: 1,
      exiting: 1,
      exited: 0,
    };

    let content = this.renderLoader();

    if (isFetching || isSubmitting) {
      content = this.renderLoader();
    } else if (errorState) {
      content = this.renderErrorState();
    } else if (!cancelConfirmed) {
      content = this.renderCancelInfo(invoiceInstallment, buttonClasses);
    } else {
      content = this.renderOutcome(buttonClasses);
    }

    return (
      <Transition timeout={50} appear in>
        {(state) => (
          <div className={`${overlayClasses} ${fadeInStates[state]}`}>
            <div className="dtc v-mid">
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                {content}
              </div>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = (
  { customer, transaction, cancelInvoiceInstallment, credentials, ui, org },
  props,
) => ({
  customer,
  transaction,
  cancelInvoiceInstallment,
  credentials,
  ui,
  org,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(CancelInvoiceInstallmentModal)),
);
