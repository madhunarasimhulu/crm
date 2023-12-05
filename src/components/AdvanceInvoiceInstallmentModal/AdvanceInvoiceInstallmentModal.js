import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import { MdClose } from 'react-icons/md';
import { MdDone } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { Loader } from '../commons';
import { FormatMoney } from '..';

import {
  closeAdvanceInvoiceInstallment,
  getAdvanceInvoiceInstallment,
  confirmAdvanceInvoiceInstallment,
  updateAdvanceInvoiceInstallment,
} from '../../actions';

class AdvanceInvoiceInstallmentModal extends Component {
  handleSelectedAdvanceInvoiceInstallmentOption = (
    advancementOption,
    index,
  ) => {
    const { dispatch } = this.props;
    dispatch(
      updateAdvanceInvoiceInstallment({
        selectedIndexOption: index,
      }),
    );
  };

  handleConfirmAdvanceInvoiceInstallment = () => {
    const {
      advanceInvoiceInstallment,
      transaction,
      customer,
      credentials,
      dispatch,
    } = this.props;
    const { isSubmitting, selectedIndexOption, invoiceInstallment } =
      advanceInvoiceInstallment;
    const { advancement_options } = invoiceInstallment;

    const installmentsToAdvance =
      advancement_options[selectedIndexOption].installments_to_advance;

    const {
      transaction: { id: transactionId },
    } = transaction;
    const { accountId } = customer;

    if (isSubmitting) {
      return false;
    }

    return dispatch(
      confirmAdvanceInvoiceInstallment(
        installmentsToAdvance,
        accountId,
        transactionId,
        credentials,
      ),
    );
  };

  handleClose = () => {
    const { advanceInvoiceInstallment, dispatch } = this.props;
    const { isOpen } = advanceInvoiceInstallment;

    if (!isOpen) {
      return false;
    }

    dispatch(closeAdvanceInvoiceInstallment());
  };

  handleKeyDown = (event) => {
    const { keyCode } = event;

    if (keyCode !== 27) {
      return false;
    }

    return this.handleClose();
  };

  componentDidUpdate(prevProps) {
    const { advanceInvoiceInstallment: prevAdvanceInvoiceInstallment } =
      prevProps;
    const {
      advanceInvoiceInstallment,
      customer,
      transaction,
      dispatch,
      credentials,
    } = this.props;

    const { isOpen: wasOpen } = prevAdvanceInvoiceInstallment;
    const { isOpen } = advanceInvoiceInstallment;
    const { accountId } = customer;
    const {
      transaction: { id: transactionId },
    } = transaction;

    if (!wasOpen && isOpen) {
      dispatch(
        getAdvanceInvoiceInstallment(accountId, transactionId, credentials),
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
          <FormattedMessage id="advanceInvoiceInstallment.title" />
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
          <FormattedMessage id="advanceInvoiceInstallment.title" />
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
          <FormattedMessage id="advanceInvoiceInstallment.emptyState" />
        </div>
      </div>
    );
  }

  renderErrorState() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="advanceInvoiceInstallment.title" />
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
          <FormattedMessage id="advanceInvoiceInstallment.errorState" />
          <br />
          <br />
          <FormattedMessage id="tryAgainLater" />
        </div>
      </div>
    );
  }

  renderAdvanceInfo = (
    invoiceInstallment,
    selectedIndexOption,
    buttonClasses,
  ) => {
    const { org } = this.props;

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
      advancement_options: advancementOptions,
    } = invoiceInstallment;

    const advanceInstallmentInvoiceOptionsContainerStyle = {
      maxHeight: '20vh',
    };

    const itemClasses = 'db cb w-100 pv3 bb b--pismo-lighter-gray animate-all';

    const itemAnimation = {
      entering: 'o-0 mt3',
      entered: 'o-100',
      exited: 'o-0 mt3',
      exiting: 'o-100',
    };

    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="advanceInvoiceInstallment.title" />
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
        <div className="pv3 center w-90">
          <div className="f3 mb3 pa2 tc">
            <FormatMoney showSymbol value={contractAmount} />
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="advanceInvoiceInstallment.firstPaymentDate" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormattedDate value={firstPaymentDate} />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="advanceInvoiceInstallment.firstPaymentAmount" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormatMoney showSymbol value={firstPaymentAmount} />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="advanceInvoiceInstallment.numberInstallments" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              {numberInstallments}
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="advanceInvoiceInstallment.principalAmount" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormatMoney showSymbol value={principalAmount} />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="advanceInvoiceInstallment.installmentAmount" />
              :
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">
              <FormatMoney showSymbol value={installmentAmount} />
            </div>
          </div>
          <div className="dt w-100 pv1">
            <div className="dtc w-60 tr pr1 pr2-ns pismo-mid-gray">
              <FormattedMessage id="advanceInvoiceInstallment.interestRate" />:
            </div>
            <div className="dtc w-40 tl pl1 pl2-ns v-mid">{interestRate}%</div>
          </div>
        </div>

        <div className="cf ph2-ns bg-pismo-light-gray pa1">
          <div className="fl w-10">
            <div className="tr pv1" />
          </div>
          <div className="fl w-30">
            <div className="tc pv1">
              <span className="f6">
                <FormattedMessage id="advanceInvoiceInstallment.installmentsToAdvance" />
              </span>
            </div>
          </div>
          <div className="fl w-30">
            <div className="tc pv1">
              <span className="f6">
                <FormattedMessage id="advanceInvoiceInstallment.totalAmount" />
              </span>
            </div>
          </div>
          <div className="fl w-30">
            <div className="tc pv1">
              <span className="f6">
                <FormattedMessage id="advanceInvoiceInstallment.inAdvance" />
              </span>
            </div>
          </div>
        </div>
        <div
          className="vh-15 overflow-y-auto"
          style={advanceInstallmentInvoiceOptionsContainerStyle}
        >
          <div className="bg-white f6 overflow-y animate-all">
            <ul className="list pa0 ma0">
              {advancementOptions.length === 0 && (
                <div className="pa3 tc bg-pismo-dark-gray">
                  <span className="f5 white">
                    <FormattedMessage id="advanceInvoiceInstallment.noAdvanceInvoiceInstallmentOptions" />
                  </span>
                </div>
              )}
              {advancementOptions.length > 0 &&
                advancementOptions.map((advancementOption, index) => {
                  const {
                    installments_to_advance: installmentsToAdvance,
                    total_amount: totalAmount,
                    in_advance: inAdvance,
                  } = advancementOption;

                  return (
                    <Transition
                      appear
                      in
                      timeout={50 * (index + 1)}
                      key={index}
                    >
                      {(state) => (
                        <li
                          key={index}
                          onClick={() => {
                            this.handleSelectedAdvanceInvoiceInstallmentOption(
                              advancementOption,
                              index,
                            );
                          }}
                          className={`${itemClasses}
                          ${
                            selectedIndexOption === index
                              ? 'white-important bg-pismo-dark-blue pismo-gray'
                              : 'hover-bg-pismo-light-gray pismo-dark-blue pointer'
                          } ${itemAnimation[state]}`}
                        >
                          <div className="mw9 center ph2">
                            <div className="cf ph2-ns">
                              <div className="fl w-10">
                                <div className="tc pv1 f6 f5-ns dib v-top ml2">
                                  {selectedIndexOption === index ? (
                                    <MdCheckCircle />
                                  ) : (
                                    <MdRadioButtonUnchecked />
                                  )}
                                </div>
                              </div>
                              <div className="fl w-30">
                                <div className="tc pv1">
                                  {installmentsToAdvance}
                                </div>
                              </div>
                              <div className="fl w-30">
                                <div className="tc pv1">
                                  {org.currency}
                                  <FormatMoney value={totalAmount} />
                                </div>
                              </div>
                              <div className="fl w-30">
                                <div className="tc pv1">
                                  {org.currency}
                                  <FormatMoney value={inAdvance} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                    </Transition>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="w-80 center pa3">
          <button
            className={buttonClasses}
            onClick={this.handleConfirmAdvanceInvoiceInstallment}
          >
            <FormattedMessage id="advanceInvoiceInstallment.confirm" />
          </button>
        </div>
      </div>
    );
  };

  renderOutcome = (buttonClasses) => (
    <div>
      <div className="tc fw4 lh-copy pt3 pb2">
        <FormattedMessage id="advanceInvoiceInstallment.title" />
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
            <FormattedMessage id="advanceInvoiceInstallment.outcomeSuccess" />
          </div>
        </div>

        <div className="w-80 center mt3">
          <button className={buttonClasses} onClick={this.handleClose}>
            <FormattedMessage id="advanceInvoiceInstallment.close" />
          </button>
        </div>
      </div>
    </div>
  );

  render() {
    const { advanceInvoiceInstallment } = this.props;
    const {
      isOpen,
      isFetching,
      invoiceInstallment,
      isSubmitting,
      errorState,
      cancelConfirmed,
      selectedIndexOption,
    } = advanceInvoiceInstallment;

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
    } else {
      if (!cancelConfirmed) {
        content = this.renderAdvanceInfo(
          invoiceInstallment,
          selectedIndexOption,
          buttonClasses,
        );
      } else {
        content = this.renderOutcome(buttonClasses);
      }

      // }
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
  { customer, transaction, advanceInvoiceInstallment, credentials, ui, org },
  props,
) => ({
  customer,
  transaction,
  advanceInvoiceInstallment,
  credentials,
  ui,
  org,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(AdvanceInvoiceInstallmentModal)),
);
