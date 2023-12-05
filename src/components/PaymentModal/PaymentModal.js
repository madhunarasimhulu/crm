import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import select from 'select';
import { MdKeyboardBackspace } from 'react-icons/md';
import { MdClose } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { MdRadioButtonUnchecked } from 'react-icons/md';

import Slider from 'rc-slider/lib/Slider';
import { Loader, TextInput } from '../commons';
import { unselect, compensateDate } from '../../utils';
import 'rc-slider/assets/index.css';
import AgreementSummary from './AgreementSummary';

import {
  closePayment,
  setPaymentCopied,
  setPaymentAmountInput,
  setPaymentAmountSlider,
  showToast,
  getTotalDue,
  generatePayment,
  payStatement,
  setPayStatementLoading,
  setPaymentEmailSending,
  setPaymentEmailSent,
  setPaymentSMSSending,
  setPaymentSMSSent,
  updatePaymentSplitInvoice,
  getMinUpfrontAmountSplitInvoice,
  getPaymentSplitInvoiceOptions,
  generateSplitInvoice,
  resetSplitInvoice,
  setSplitInvoiceAmountInput,
  setSplitInvoiceAmountSlider,
  getAgreementSummary,
  getAgreementDueDates,
} from '../../actions';
import { FormatMoney } from '..';

const inputClasses = `
f2dot5
`;

class PaymentModal extends Component {
  handleAmountInputSliderChange = (value) => {
    const { payment, dispatch } = this.props;
    const { totalDue } = payment;
    const {
      consolidated: { max },
    } = totalDue;
    const safeValue = value < max ? Math.floor(value) : max;

    dispatch(setPaymentAmountSlider(safeValue));
    dispatch(setPaymentAmountInput(safeValue));

    dispatch(setSplitInvoiceAmountSlider(safeValue));
    dispatch(setSplitInvoiceAmountInput(safeValue));
  };

  handleAmountInputSplitInvoiceSliderChange = (value) => {
    const { splitInvoice, dispatch } = this.props;
    const { totalDue } = splitInvoice;
    const {
      consolidated: { max },
    } = totalDue;
    const safeValue = value < max ? Math.floor(value) : max;

    dispatch(setPaymentAmountSlider(safeValue));
    dispatch(setPaymentAmountInput(safeValue));

    dispatch(setSplitInvoiceAmountSlider(safeValue));
    dispatch(setSplitInvoiceAmountInput(safeValue));
  };

  handleAmountInputChange = (event, value, maskedValue) => {
    const { payment, dispatch } = this.props;
    const { totalDue } = payment;
    const {
      consolidated: { max },
    } = totalDue;

    const data = {
      value,
      inputValidate: value > max,
    };

    dispatch(setPaymentAmountInput(data));
    dispatch(setPaymentAmountSlider(value >= max ? max : value));

    dispatch(setSplitInvoiceAmountInput(value));
    dispatch(setSplitInvoiceAmountSlider(value >= max ? max : value));
  };

  handleAmountInputSplitInvoiceChange = (event, value, maskedValue) => {
    const { splitInvoice, dispatch } = this.props;
    const { totalDue } = splitInvoice;
    const {
      consolidated: { max },
    } = totalDue;

    dispatch(setPaymentAmountInput(value));
    dispatch(setPaymentAmountSlider(value >= max ? max : value));

    dispatch(setSplitInvoiceAmountInput(value));
    dispatch(setSplitInvoiceAmountSlider(value >= max ? max : value));
  };

  handleSplitInvoiceAfterChange = () => {
    this.handleSplitInvoice();
  };

  handleSelectedSplitInvoiceOption = (installment, index) => {
    const { dispatch } = this.props;

    dispatch(
      updatePaymentSplitInvoice({
        selectedIndexOption: index,
      }),
    );
  };

  handlePayStatement = () => {
    const { payment, dispatch, customer, credentials, routeWatcher } =
      this.props;
    const { isLoading, amountInput } = payment;
    const { accountId } = customer;
    const messages = {
      success: this.translate('paymentModal.payStatement.successful'),
      error: this.translate('paymentModal.payment.installments.error'),
    };

    if (isLoading) {
      return false;
    }

    dispatch(setPayStatementLoading(true));
    dispatch(
      payStatement(accountId, amountInput, messages, routeWatcher, credentials),
    );
  };

  handleGeneratePayment = (event, send_email, send_sms) => {
    const { payment, dispatch, customer, credentials } = this.props;
    const {
      isSubmitting,
      amountInput,
      totalDue: { payment_date },
    } = payment;
    const { accountId } = customer;

    if (isSubmitting) {
      return false;
    }

    return dispatch(
      generatePayment(
        accountId,
        amountInput,
        payment_date,
        credentials,
        send_email,
        send_sms,
      ),
    ).catch(() =>
      dispatch(
        showToast({
          message: this.translate('paymentModal.error.biggerValue'),
          style: 'error',
        }),
      ),
    );
  };

  handleReviewSplitInvoice = () => {
    const { dispatch } = this.props;
    dispatch(updatePaymentSplitInvoice({ reviewSplitInvoice: true }));
  };

  handleGenerateSplitInvoice = (event, send_email, send_sms) => {
    const { splitInvoice, dispatch, customer, credentials } = this.props;
    const {
      isSubmitting,
      selectedIndexOption,
      splitOptions: { upfront_amount, first_payment_date, installment_options },
    } = splitInvoice;
    const { accountId } = customer;

    const numberInstallments =
      installment_options[selectedIndexOption].number_of_installments;

    if (isSubmitting) {
      return false;
    }

    return dispatch(
      generateSplitInvoice(
        accountId,
        upfront_amount,
        first_payment_date,
        numberInstallments,
        credentials,
        send_email,
        send_sms,
      ),
    );
  };

  handleGenerateSplitInvoiceOptions = (upfrontAmount) => {
    const { payment, customer, dispatch, credentials } = this.props;
    const { accountId } = customer;
    const { amountInput } = payment;

    const amount = upfrontAmount || amountInput;

    return dispatch(
      getPaymentSplitInvoiceOptions(accountId, amount, credentials),
    );
  };

  handleSplitInvoice = () => {
    const { dispatch, payment } = this.props;
    const {
      amountInput,
      totalDue: { principal_amount: principalAmountPayment },
    } = payment;

    // TODO: check amount that can be paid in installments (is currently fixed at {this.props.org.currency}10,00)
    const maxUpfrontAmount = principalAmountPayment - 10;

    dispatch(resetSplitInvoice());
    dispatch(
      updatePaymentSplitInvoice({
        show: true,
        loading: true,
        amountInput,
        sliderInput: amountInput,
      }),
    );
    return this.handleGenerateSplitInvoiceOptions().then(() => {
      const {
        splitInvoice: {
          splitOptions: { min_upfront_amount: minUpfrontAmount },
        },
      } = this.props;

      dispatch(
        updatePaymentSplitInvoice({
          loading: false,
          totalDue: {
            consolidated: {
              min: minUpfrontAmount,
              max: maxUpfrontAmount,
            },
          },
        }),
      );
    });
  };

  handleSendByEmail = () => {
    const { dispatch } = this.props;

    dispatch(setPaymentEmailSending(true));
    return this.handleGeneratePayment(null, true, undefined)
      .then(() => dispatch(setPaymentEmailSent()))
      .catch(() =>
        dispatch(
          showToast({
            message: this.translate('paymentModal.error.biggerValue'),
            style: 'error',
          }),
        ),
      );
  };

  handleSendBySMS = () => {
    const { dispatch } = this.props;

    dispatch(setPaymentSMSSending(true));
    return this.handleGeneratePayment(null, undefined, true)
      .then(() => dispatch(setPaymentSMSSent()))
      .catch(() =>
        dispatch(
          showToast({
            message: this.translate('paymentModal.error.biggerValue'),
            style: 'error',
          }),
        ),
      );
  };

  handleCopy = () => {
    if (!this.bankslipEl) {
      return false;
    }

    select(this.bankslipEl);
    document.execCommand('copy');
    this.props.dispatch(setPaymentCopied(true));
    unselect();
  };

  handleBack = () => {
    const { dispatch, splitInvoice } = this.props;
    const { reviewSplitInvoice } = splitInvoice;

    if (reviewSplitInvoice) {
      dispatch(
        updatePaymentSplitInvoice({
          show: true,
          reviewSplitInvoice: false,
        }),
      );
    } else {
      dispatch(resetSplitInvoice());
    }
  };

  handleClose = () => {
    const { payment, dispatch } = this.props;
    const { isOpen } = payment;

    if (!isOpen) {
      return false;
    }

    dispatch(closePayment());
    dispatch(
      updatePaymentSplitInvoice({
        show: false,
        reviewSplitInvoice: false,
      }),
    );
  };

  handleKeyDown = (event) => {
    const { keyCode } = event;

    if (keyCode !== 27) {
      return false;
    }

    return this.handleClose();
  };

  handleBankslipRef = (el) => {
    this.bankslipEl = el;
  };

  handleCurrencyInputRef = (el) => {
    this.currencyInputEl = el;
  };

  handleCurrencySplitInvoiceInputRef = (el) => {
    this.currencySplitInvoiceInputEl = el;
  };

  handlePaymentAgreement = async () => {
    const { dispatch, credentials, customer } = this.props;
    const { accountId } = customer;

    try {
      const responseDates = await dispatch(
        getAgreementDueDates(accountId, credentials),
      );
      if (responseDates.data.dates.length === 0) {
        this.handleErrorOnPaymentAgreementBase('errorDueDates');
      } else {
        const responseSumary = await dispatch(
          getAgreementSummary(accountId, credentials),
        );
        if (responseSumary.data.min_payment_percent <= 0) {
          this.handleErrorOnPaymentAgreementBase('error');
          throw Error('Erro Agreement');
        }
      }
    } catch {
      this.handleErrorOnPaymentAgreementBase('error');
    }
  };

  handleErrorOnPaymentAgreementBase = (msg) => {
    const { dispatch } = this.props;
    dispatch(resetSplitInvoice());
    dispatch(
      showToast({
        message: this.translate(`paymentModal.payment.installments.${msg}`),
        style: 'error',
      }),
    );
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  componentDidUpdate(prevProps) {
    const { payment: prevPayment } = prevProps;
    const {
      payment,
      splitInvoice,
      customer,
      statements,
      dispatch,
      credentials,
    } = this.props;

    const { isOpen: wasOpen } = prevPayment;
    const { isOpen, amountInput } = payment;
    const { amountInput: amountSplitInvoiceInput } = splitInvoice;
    const { accountId } = customer;

    const inputEl = this.currencyInputEl;
    const inputSplitInvoiceEl = this.currencySplitInvoiceInputEl;

    if (!wasOpen && isOpen) {
      dispatch(getTotalDue(accountId, null, undefined, credentials));

      const statementId = statements.selectedMonth.statement.id;
      dispatch(
        getMinUpfrontAmountSplitInvoice(accountId, statementId, credentials),
      );
    }

    if (inputEl && inputEl.input.value !== amountInput) {
      inputEl.setMaskedValue(amountInput);
    }

    if (
      inputSplitInvoiceEl &&
      inputSplitInvoiceEl.input.value !== amountSplitInvoiceInput
    ) {
      inputSplitInvoiceEl.setMaskedValue(amountSplitInvoiceInput);
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // render functions for each state

  renderLoaderPayment() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2" data-testid="title-display">
          <FormattedMessage id="paymentModal.title" />
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

  renderLoaderSplitInvoice() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="paymentModal.splitInvoice.title" />
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

  renderEmptyStatePayment() {
    return (
      <div>
        <div
          className="tc fw4 lh-copy pt3 pb2"
          data-testid="title-display-empty"
        >
          <FormattedMessage id="paymentModal.title" />
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
        <div
          className="pv5 w-70 center tc f4"
          data-testid="content-display-empty"
        >
          <FormattedMessage id="paymentModal.emptyState" />
        </div>
      </div>
    );
  }

  renderErrorStatePayment() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="paymentModal.title" />
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
        <div className="pv5 w-70 center tc dark-red">
          <FormattedMessage id="paymentModal.errorState" />
          <br />
          <br />
          <FormattedMessage id="tryAgainLater" />
        </div>
      </div>
    );
  }

  renderErrorStateSplitInvoice() {
    return (
      <div>
        <div
          className="absolute top-0 left-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleBack}
          >
            <MdKeyboardBackspace />
          </button>
        </div>

        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="paymentModal.splitInvoice.title" />
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

        <div className="pv5 w-70 center tc dark-red">
          <FormattedMessage id="paymentModal.errorState" />
          <br />
          <br />
          <FormattedMessage id="tryAgainLater" />
        </div>
      </div>
    );
  }

  renderFormPayment = (
    amountInput,
    sliderInput,
    minAmount,
    closedDueBalance,
    min,
    max,
    minUpfrontAmount,
    generatePaymentButtonClasses,
    inputValidate,
    isLoading,
  ) => {
    const debt = amountInput < minAmount;

    // TODO: check amount that can be paid in installments (is currently fixed at {this.props.org.currency}10,00)
    const commonButtonClasses =
      'button-reset db w-100 ph1 pv2dot7 br2 fw4 f7dot5';

    const paymentButtonClasses = `
      ${commonButtonClasses} bn bg-pismo-silver pismo-darker
      ${!inputValidate ? '' : 'o-50 noclick'}
    `;

    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="paymentModal.title" />
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
        <div className="pv4 tc">
          <div className="f4 mb2" data-testid="input-value-title">
            <FormattedMessage id="paymentModal.inputLabel" />
          </div>

          <div className="w-70 center" data-testid="input-value-content">
            <TextInput
              type="currency"
              value={amountInput}
              alignCenter
              className={`${inputClasses} ${
                debt || inputValidate
                  ? 'pismo-pink b--pismo-pink'
                  : 'pismo-near-black b--pismo-gray'
              }`}
              onChange={this.handleAmountInputChange}
            />

            <div className={`mt4 ${amountInput > max ? 'o-50' : ''}`}>
              <div className="pismo-mid-gray">
                <div className="dib v-mid w-50 tl">
                  <FormatMoney value={min} />
                </div>
                <div className="dib v-mid w-50 tr">
                  <FormatMoney value={max} />
                </div>
              </div>

              <Slider
                min={min}
                max={max}
                step={0.01}
                defaultValue={parseFloat(sliderInput, 10)}
                value={parseFloat(sliderInput, 10)}
                onChange={this.handleAmountInputSliderChange}
              />

              {minAmount > 0 && (
                <div className="pismo-gray f6 mt1">
                  <FormattedMessage id="minimumPayment" />:{' '}
                  <FormatMoney value={minAmount} showSymbol />
                </div>
              )}

              {closedDueBalance > 0 && (
                <div className="pismo-gray f6 mt1">
                  <FormattedMessage id="paymentModal.closedValue" />:{' '}
                  <FormatMoney value={closedDueBalance} showSymbol />
                </div>
              )}
            </div>
          </div>

          <div
            className={`w-80 center tc pv2 f6 mt3 pismo-pink ${
              debt || inputValidate ? 'o-100' : 'o-0'
            } animate-all`}
          >
            <FormattedMessage
              id={
                debt
                  ? 'paymentModal.lowerThanMinimumDisclaimer'
                  : 'paymentModal.error.biggerValue'
              }
            />
          </div>

          <div className="w-80 center mt3">
            <button
              data-testid="button-generate-bankslip"
              className={paymentButtonClasses}
              onClick={this.handlePayStatement}
              disabled={inputValidate}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <FormattedMessage id="paymentModal.payStatement" />
              )}
            </button>
          </div>

          {/* <div className="w-80 center mt3">
            <button
              data-testid="button-generate-bankslip"
              className={paymentButtonClasses}
              onClick={this.handleGeneratePayment}
              disabled={inputValidate}
            >
              <FormattedMessage id="paymentModal.generatePayment" />
            </button>
          </div>

          <div className="w-80 center mt3">
            <button
              data-testid="button-split-invoice"
              className={splitInvoiceButtonClasses}
              onClick={this.handleSplitInvoice}
              disabled={!enableSplitInvoiceButton}
            >
              <FormattedMessage id="paymentModal.splitInvoice" />
            </button>
          </div>

          <div className="w-80 center mt3">
            <button
              data-testid="button-agreement"
              className={splitInvoiceButtonClasses}
              onClick={this.handlePaymentAgreement}
            >
              <FormattedMessage id="paymentModal.payment.agreement" />
            </button>
          </div> */}
        </div>
      </div>
    );
  };

  renderFormSplitInvoice = (
    totalInvoice,
    amountInput,
    sliderInput,
    min,
    max,
    generatePaymentButtonClasses,
    loading,
    totalDue,
    selectedIndexOption = 0,
    splitOptions,
  ) => {
    const { installment_options: installmentOptions } = splitOptions;
    const remainingAmount = totalInvoice - amountInput;
    const indexSelectedInstallmentOption = selectedIndexOption;

    const generateSplitPaymentButtonClasses =
      installmentOptions && installmentOptions.length === 0
        ? `${generatePaymentButtonClasses} noclick`
        : generatePaymentButtonClasses;

    const itemClasses = 'db cb w-100 pv3 bb b--pismo-lighter-gray animate-all';

    const splitOptionsContainerStyle = {
      maxHeight: '20vh',
    };

    const itemAnimation = {
      entering: 'o-0 mt3',
      entered: 'o-100',
      exited: 'o-0 mt3',
      exiting: 'o-100',
    };

    return (
      <div>
        <div
          className="absolute top-0 left-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleBack}
          >
            <MdKeyboardBackspace />
          </button>
        </div>

        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="paymentModal.splitInvoice.title" />
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

        <div className="pv4 tc">
          <div className="f4 mb2">
            <FormattedMessage
              id="paymentModal.splitInvoice.inputLabel"
              values={{
                bold: (
                  <b>
                    <FormattedMessage id="paymentModal.splitInvoice.inputLabel02" />
                  </b>
                ),
              }}
            />
          </div>

          <div className="w-70 center">
            <TextInput
              type="currency"
              value={amountInput}
              alignCenter
              className={`${inputClasses} pismo-near-black b--pismo-gray`}
              onChange={this.handleAmountInputSplitInvoiceChange}
            />

            <div className={`mt4 ${amountInput > max ? 'o-50' : ''}`}>
              <div className="pismo-mid-gray">
                <div className="dib v-mid w-50 tl">
                  <FormatMoney value={min} />
                </div>
                <div className="dib v-mid w-50 tr">
                  <FormatMoney value={max} />
                </div>
              </div>

              <Slider
                min={min}
                max={max}
                step={0.01}
                defaultValue={parseFloat(sliderInput, 10)}
                value={parseFloat(sliderInput, 10)}
                onChange={this.handleAmountInputSplitInvoiceSliderChange}
                onAfterChange={this.handleSplitInvoiceAfterChange}
              />
            </div>
          </div>

          <div className="tc fw4 lh-copy pt3 pb2 ph4">
            <FormattedMessage
              id="paymentModal.splitInvoice.subtitle"
              values={{
                value: (
                  <b>
                    {this.props.org.currency}
                    <FormatMoney value={remainingAmount} />
                  </b>
                ),
              }}
            />
          </div>

          {loading ? (
            <div className="pv5 tc bg-pismo-mid-gray">
              <Loader size="large" />
            </div>
          ) : (
            <div
              className="vh-15 overflow-y-auto"
              style={splitOptionsContainerStyle}
            >
              <div className="bg-white f6 overflow-y animate-all">
                <ul className="list pa0 ma0">
                  {installmentOptions && installmentOptions.length === 0 && (
                    <div className="pa3 tc bg-pismo-dark-gray">
                      <span className="f5 white">
                        <FormattedMessage id="paymentModal.splitInvoice.noInstallmentOptions" />
                      </span>
                    </div>
                  )}
                  {installmentOptions &&
                    installmentOptions.length > 0 &&
                    installmentOptions.map((installment, index) => {
                      const {
                        number_of_installments,
                        installment_amount,
                        total_amount,
                        interest: { interest_rate, total_interest_amount },
                        taxes: { total_fixed_iof_amount, total_iof_amount },
                      } = installment;

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
                                this.handleSelectedSplitInvoiceOption(
                                  installment,
                                  index,
                                );
                              }}
                              className={`${itemClasses}
                            ${
                              indexSelectedInstallmentOption === index
                                ? 'white-important bg-pismo-dark-blue pismo-gray'
                                : 'hover-bg-pismo-light-gray pismo-dark-blue pointer'
                            } ${itemAnimation[state]}`}
                            >
                              {indexSelectedInstallmentOption === index && (
                                <div className="mw9 center ph2">
                                  <div className="cf ph2-ns">
                                    <div className="fl w-5">
                                      <div className="tc pv1" />
                                    </div>
                                    <div className="fl w-25">
                                      <div className="tc pv1" />
                                    </div>
                                    <div className="fl w-25">
                                      <div className="tc pv1">
                                        <span className="f7 pismo-mid-gray">
                                          <FormattedMessage id="paymentModal.splitInvoice.tax" />{' '}
                                          {`(${total_fixed_iof_amount}% am)`}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="fl w-25">
                                      <div className="tc pv1">
                                        <span className="f7 pismo-mid-gray">
                                          <FormattedMessage id="paymentModal.splitInvoice.rates" />{' '}
                                          {`(${interest_rate}% am)`}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="fl w-20">
                                      <div className="tc pv1">
                                        <span className="f7 pismo-mid-gray">
                                          <FormattedMessage id="paymentModal.splitInvoice.total" />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="mw9 center ph2">
                                <div className="cf ph2-ns">
                                  <div className="fl w-5">
                                    <div className="tc pv1 f6 f5-ns dib v-top">
                                      {indexSelectedInstallmentOption ===
                                      index ? (
                                        <MdCheckCircle />
                                      ) : (
                                        <MdRadioButtonUnchecked />
                                      )}
                                    </div>
                                  </div>
                                  <div className="fl w-25">
                                    <div className="tc pv1">
                                      {`${number_of_installments} x ${this.props.org.currency}`}
                                      <FormatMoney value={installment_amount} />
                                    </div>
                                  </div>
                                  <div className="fl w-25">
                                    <div className="tc pv1">
                                      {this.props.org.currency}
                                      <FormatMoney value={total_iof_amount} />
                                    </div>
                                  </div>
                                  <div className="fl w-25">
                                    <div className="tc pv1">
                                      {this.props.org.currency}
                                      <FormatMoney
                                        value={total_interest_amount}
                                      />
                                    </div>
                                  </div>
                                  <div className="fl w-20">
                                    <div className="tc pv1">
                                      {this.props.org.currency}
                                      <FormatMoney value={total_amount} />
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
          )}

          <div className="w-80 center mt4">
            <button
              className={generateSplitPaymentButtonClasses}
              onClick={this.handleReviewSplitInvoice}
              disabled={installmentOptions && installmentOptions.length === 0}
            >
              <FormattedMessage id="paymentModal.advance" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderReviewSplitInvoice = (splitInvoice, generatePaymentButtonClasses) => {
    const { splitOptions, selectedIndexOption } = splitInvoice;
    const {
      upfront_amount: upfrontAmount,
      financed_amount: financedAmount,
      installment_options: installmentOptions,
    } = splitOptions;
    const installmentOption = installmentOptions[selectedIndexOption];

    const {
      number_of_installments,
      installment_amount,
      total_amount,
      last_payment_date,
      interest: { interest_rate, total_interest_amount },
      taxes: { total_fixed_iof_amount, total_iof_amount },
    } = installmentOption;

    const total = upfrontAmount + total_amount;

    return (
      <div>
        <div
          className="absolute top-0 left-1 mt1"
          style={{ marginTop: '12px' }}
        >
          <button
            type="button"
            className="button-reset bn bg-transparent pointer f4"
            onClick={this.handleBack}
          >
            <MdKeyboardBackspace />
          </button>
        </div>

        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="paymentModal.splitInvoice.title" />
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

        <div className="pv2 tc">
          <div className="w-80 center mt4">
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-50">
                  <div className="tl pv1">
                    <span className="f6 f5-ns pismo-mid-gray">
                      <FormattedMessage id="paymentModal.splitInvoice.upfront" />
                    </span>
                  </div>
                </div>
                <div className="fl w-50">
                  <div className="tr pv1">
                    <span className="f6 f5-ns">
                      {this.props.org.currency}
                      <FormatMoney value={upfrontAmount} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-50">
                  <div className="tl pv2">
                    <span className="f6 f5-ns pismo-mid-gray">
                      <FormattedMessage id="paymentModal.splitInvoice.totalRemaining" />
                    </span>
                  </div>
                </div>
                <div className="fl w-50">
                  <div className="tr pv2">
                    <span className="f6 f5-ns">
                      {this.props.org.currency}
                      <FormatMoney value={financedAmount} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-50">
                  <div className="tl pv2">
                    <span className="f6 f5-ns pismo-mid-gray">
                      <FormattedMessage id="paymentModal.splitInvoice.tax" />{' '}
                      {`(${total_fixed_iof_amount}% am)`}
                    </span>
                  </div>
                </div>
                <div className="fl w-50">
                  <div className="tr pv2">
                    <span className="f6 f5-ns">
                      {this.props.org.currency}
                      <FormatMoney value={total_iof_amount} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-50">
                  <div className="tl pv2">
                    <span className="f6 f5-ns pismo-mid-gray">
                      <FormattedMessage id="paymentModal.splitInvoice.rates" />{' '}
                      {`(${interest_rate}% am)`}
                    </span>
                  </div>
                </div>
                <div className="fl w-50">
                  <div className="tr pv2">
                    <span className="f6 f5-ns">
                      {this.props.org.currency}
                      <FormatMoney value={total_interest_amount} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pv2 tc mt2">
          <div className="w-80 center mt1">
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-100">
                  <div className="tr pv1">
                    <span className="f6 f5-ns pismo-mid-gray">
                      <FormattedMessage id="paymentModal.splitInvoice.total" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-80 center mt1">
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-100">
                  <div className="tr pv1">
                    <span className="f3 f4-ns">{this.props.org.currency}</span>
                    <span className="f3 f4-ns b">
                      <FormatMoney value={total} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-80 center mt1">
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-100">
                  <div className="tr pv1">
                    <span className="f3 f4-ns">
                      {`${number_of_installments} x ${this.props.org.currency}`}
                      <FormatMoney value={installment_amount} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-80 center mt1">
            <div className="mw9 center ph2">
              <div className="cf ph2-ns">
                <div className="fl w-100">
                  <div className="tr pv1">
                    <span className="f6 f5-ns pismo-mid-gray">
                      <FormattedMessage id="paymentModal.splitInvoice.lastDateInfo" />{' '}
                      <FormattedDate
                        value={compensateDate(last_payment_date)}
                        month="numeric"
                        year="numeric"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pv4 tc">
          <div className="w-80 center">
            <button
              className={generatePaymentButtonClasses}
              onClick={this.handleGenerateSplitInvoice}
            >
              <FormattedMessage id="paymentModal.confirm" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderOutcomePayment = (
    generated,
    hasCopied,
    isSendingEmail,
    hasSentEmail,
    isSendingSMS,
    hasSentSMS,
    copyButtonClasses,
    emailButtonClasses,
    smsButtonClasses,
  ) => (
    <div>
      <div className="tc fw4 lh-copy pt3 pb2">
        <FormattedMessage id="paymentModal.title" />
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
        <div className="pismo-light-silver">
          <FormattedMessage id="paymentModal.validUntil" />
          :&nbsp;
          <FormattedDate
            value={compensateDate(generated.due_date)}
            day="2-digit"
            month="long"
          />
        </div>

        <div className="f2dot5 pv2">
          <span className="fw4">{this.props.org.currency}</span>
          <span className="b">
            <FormatMoney value={generated.amount} />
          </span>
        </div>

        <div className="w-85 center tc">
          <div className="pv4 f6 fw4 lh-title">
            <FormattedMessage id="paymentModal.instructions" />
            <br />
            <br />
            <FormattedMessage id="paymentModal.warningBankslip" />
          </div>

          <div className="ph3 mv3 f6 b" ref={this.handleBankslipRef}>
            {generated.bankslip}
          </div>

          <button className={copyButtonClasses} onClick={this.handleCopy}>
            <FormattedMessage
              id={`paymentModal.${hasCopied ? 'copied' : 'copy'}`}
            />
          </button>

          <div className="mt2">
            <div className="dib v-mid w-50 pr1">
              <button
                className={smsButtonClasses}
                onClick={this.handleSendBySMS}
              >
                {isSendingSMS ? (
                  <Loader size="extra-small" />
                ) : (
                  <FormattedMessage
                    id={`paymentModal.${
                      hasSentSMS ? 'sentBySMS' : 'sendBySMS'
                    }`}
                  />
                )}
              </button>
            </div>
            <div className="dib v-mid w-50 pl1">
              <button
                className={emailButtonClasses}
                onClick={this.handleSendByEmail}
              >
                {isSendingEmail ? (
                  <Loader size="extra-small" />
                ) : (
                  <FormattedMessage
                    id={`paymentModal.${
                      hasSentEmail ? 'sentByEmail' : 'sendByEmail'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  renderOutcomeSplitInvoice = (
    generated,
    hasCopied,
    isSendingEmail,
    hasSentEmail,
    isSendingSMS,
    hasSentSMS,
    copyButtonClasses,
    emailButtonClasses,
    smsButtonClasses,
  ) => (
    <div>
      <div className="tc fw4 lh-copy pt3 pb2">
        <FormattedMessage id="paymentModal.splitInvoice.title" />
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
        <div className="white bg-pismo-dark-blue pv3">
          <FormattedMessage id="paymentModal.splitInvoice.outcomeTitle" />
        </div>

        <div className="f2dot5 pv3">
          <span className="fw4">{this.props.org.currency}</span>
          <span className="b">
            <FormatMoney value={generated.amount} />
          </span>
        </div>

        <div className="w-85 center tc">
          <div className="pv2 f6 fw4 lh-title">
            <FormattedMessage id="paymentModal.splitInvoice.outcomeSubtitle" />
          </div>

          <div className="ph3 mv3 f6 b" ref={this.handleBankslipRef}>
            {generated.bankslip}
          </div>

          <button className={copyButtonClasses} onClick={this.handleCopy}>
            <FormattedMessage
              id={`paymentModal.${hasCopied ? 'copied' : 'copy'}`}
            />
          </button>

          <div className="mt2">
            <div className="dib v-mid w-50 pr1">
              <button
                className={smsButtonClasses}
                onClick={this.handleSendBySMS}
              >
                {isSendingSMS ? (
                  <Loader size="extra-small" />
                ) : (
                  <FormattedMessage
                    id={`paymentModal.${
                      hasSentSMS ? 'sentBySMS' : 'sendBySMS'
                    }`}
                  />
                )}
              </button>
            </div>
            <div className="dib v-mid w-50 pl1">
              <button
                className={emailButtonClasses}
                onClick={this.handleSendByEmail}
              >
                {isSendingEmail ? (
                  <Loader size="extra-small" />
                ) : (
                  <FormattedMessage
                    id={`paymentModal.${
                      hasSentEmail ? 'sentByEmail' : 'sendByEmail'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      payment,
      splitInvoice,
      statements,
      ui,
      dispatch,
      customer,
      credentials,
      org,
    } = this.props;
    const { isOpen } = payment;

    if (!isOpen) {
      return null;
    }

    // payment info
    const {
      amountInput,
      sliderInput,
      isFetchingTotalDue,
      totalDue,
      isSubmitting,
      generated,
      hasCopied,
      isLoading,
      isSendingEmail,
      hasSentEmail,
      isSendingSMS,
      hasSentSMS,
      errorState,
      minUpfrontAmount,
      inputValidate,
    } = payment;

    const {
      consolidated: { min, max },
      minimum_payment: minAmount,
      closed_due_balance: closedDueBalance,
    } = totalDue;

    // split invoice info
    const {
      show: showSplitInvoice,
      totalDue: totalDueSplitInvoice,
      isSubmitting: isSubmittingSplitInvoice,
      generated: generatedSplitInvoice,
      hasCopied: hasCopiedSplitInvoice,
      isSendingEmail: isSendingEmailSplitInvoice,
      hasSentEmail: hasSentEmailSplitInvoice,
      isSendingSMS: isSendingSMSSplitInvoice,
      hasSentSMS: hasSentSMSSplitInvoice,
      errorState: errorStateSplitInvoice,
      loading: loadingSplitInvoice,
      selectedIndexOption: indexSelectedInstallmentOption,
      splitOptions,
      reviewSplitInvoice,
    } = splitInvoice;

    const minSplitInvoice = minUpfrontAmount;
    // TODO: check amount that can be paid in installments (is currently fixed at {this.props.org.currency} 10,00)
    const maxSplitInvoice = max - 10;

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw5dot5-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const commonButtonClasses =
      'button-reset db w-100 ph2 pv2dot7 br2 fw4 f7dot5 pointer';

    const generatePaymentButtonClasses = `
      ${commonButtonClasses} bn bg-pismo-silver pismo-darker
      ${amountInput >= min ? '' : 'o-50 noclick'}
    `;

    const copyButtonClasses = `
      ${commonButtonClasses} bn
      ${hasCopied ? 'bg-pismo-dark-blue white' : 'bg-pismo-silver pismo-darker'}
    `;

    const secondaryButtonClasses = `
      ${commonButtonClasses}
    `;

    const emailButtonClasses = `
      ${secondaryButtonClasses}
      ${
        hasSentEmail
          ? 'bg-pismo-dark-blue white'
          : 'bg-white pismo-darker ba bw-pismo-2 b--pismo-silver'
      }
    `;

    const smsButtonClasses = `
      ${secondaryButtonClasses}
      ${
        hasSentSMS
          ? 'bg-pismo-dark-blue white'
          : 'bg-white pismo-darker ba bw-pismo-2 b--pismo-silver'
      }
    `;

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

    let content = this.renderLoaderPayment();

    if (isFetchingTotalDue || isSubmitting) {
      content = this.renderLoaderPayment();
    } else if (showSplitInvoice) {
      if (isSubmittingSplitInvoice) {
        content = this.renderLoaderSplitInvoice();
      } else if (errorStateSplitInvoice) {
        content = this.renderErrorStateSplitInvoice();
      } else if (reviewSplitInvoice) {
        content = this.renderReviewSplitInvoice(
          splitInvoice,
          generatePaymentButtonClasses,
        );
      } else if (!generatedSplitInvoice || !generatedSplitInvoice.bankslip) {
        content = this.renderFormSplitInvoice(
          max,
          amountInput,
          sliderInput,
          minSplitInvoice,
          maxSplitInvoice,
          generatePaymentButtonClasses,
          loadingSplitInvoice,
          totalDueSplitInvoice,
          indexSelectedInstallmentOption,
          splitOptions,
        );
      } else {
        content = this.renderOutcomeSplitInvoice(
          generatedSplitInvoice,
          hasCopiedSplitInvoice,
          isSendingEmailSplitInvoice,
          hasSentEmailSplitInvoice,
          isSendingSMSSplitInvoice,
          hasSentSMSSplitInvoice,
          copyButtonClasses,
          emailButtonClasses,
          smsButtonClasses,
        );
      }
    } else if (errorState) {
      content = this.renderErrorStatePayment();
    } else if (max <= 0) {
      content = this.renderEmptyStatePayment();
    } else if (!generated || !generated.bankslip) {
      content = this.renderFormPayment(
        amountInput,
        sliderInput,
        minAmount,
        closedDueBalance,
        min,
        max,
        minUpfrontAmount,
        generatePaymentButtonClasses,
        inputValidate,
        isLoading,
      );
    } else {
      content = this.renderOutcomePayment(
        generated,
        hasCopied,
        isSendingEmail,
        hasSentEmail,
        isSendingSMS,
        hasSentSMS,
        copyButtonClasses,
        emailButtonClasses,
        smsButtonClasses,
      );
    }

    if (statements.agreement.isAgree) {
      content = (
        <AgreementSummary
          ui={ui}
          dispatch={dispatch}
          agreement={statements.agreement}
          handleClose={this.handleClose}
          credentials={credentials}
          customer={customer}
          currency={org.currency}
        />
      );
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
  {
    customer,
    payment,
    splitInvoice,
    credentials,
    ui,
    routeWatcher,
    statements,
    org,
  },
  props,
) => ({
  customer,
  payment,
  splitInvoice,
  statements,
  credentials,
  ui,
  org,
  routeWatcher,
  ...props,
});

export default connect(mapStateToProps)(withRouter(injectIntl(PaymentModal)));
