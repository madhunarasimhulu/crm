import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import select from 'select';
import { MdClose } from 'react-icons/md';
import { unselect, compensateDate } from '../../utils';
import { Loader, TextInput } from '../commons';

import {
  closeRecharge,
  generateRecharge,
  setRechargeCopied,
  setRechargeAmountInput,
  setRechargeEmailSending,
  setRechargeEmailSent,
  setRechargeSMSSending,
  setRechargeSMSSent,
} from '../../actions';
import { FormatMoney } from '..';

class RechargeModal extends Component {
  handleAmountInputChange = (event, value) => {
    const { dispatch } = this.props;
    dispatch(setRechargeAmountInput(value));
  };

  handleGenerateRecharge = (event, send_email, send_sms) => {
    const { recharge, dispatch, customer, credentials } = this.props;
    const { isSubmitting, amountInput } = recharge;
    const { accountId } = customer;

    if (isSubmitting) {
      return false;
    }

    const registered = true;
    return dispatch(
      generateRecharge(
        accountId,
        amountInput,
        registered,
        credentials,
        send_email,
        send_sms,
      ),
    );
  };

  handleSendByEmail = () => {
    const { dispatch } = this.props;

    dispatch(setRechargeEmailSending(true));
    return this.handleGenerateRecharge(null, true, undefined).then(() =>
      dispatch(setRechargeEmailSent()),
    );
  };

  handleSendBySMS = () => {
    const { dispatch } = this.props;

    dispatch(setRechargeSMSSending(true));
    return this.handleGenerateRecharge(null, undefined, true).then(() =>
      dispatch(setRechargeSMSSent()),
    );
  };

  handleCopy = () => {
    if (!this.bankslipEl) {
      return false;
    }

    select(this.bankslipEl);
    document.execCommand('copy');
    this.props.dispatch(setRechargeCopied(true));
    unselect();
  };

  handleBack = () => {};

  handleClose = () => {
    const { recharge, dispatch } = this.props;
    const { isOpen } = recharge;

    if (!isOpen) {
      return false;
    }

    dispatch(closeRecharge());
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

  translate = (id) => this.props.intl.formatMessage({ id });

  componentDidUpdate(prevProps) {
    const { recharge } = this.props;
    const { amountInput } = recharge;

    const inputEl = this.currencyInputEl;

    if (inputEl && inputEl.input.value !== amountInput) {
      inputEl.setMaskedValue(amountInput);
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  renderLoaderRecharge() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="rechargeModal.title" />
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

  renderEmptyStateRecharge() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="rechargeModal.title" />
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
          <FormattedMessage id="rechargeModal.emptyState" />
        </div>
      </div>
    );
  }

  renderErrorStateRecharge() {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="rechargeModal.title" />
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
          <FormattedMessage id="rechargeModal.errorState" />
          <br />
          <br />
          <FormattedMessage id="tryAgainLater" />
        </div>
      </div>
    );
  }

  renderFormRecharge = (
    amountInput,
    minAmount,
    generateRechargeButtonClasses,
  ) => {
    return (
      <div>
        <div className="tc fw4 lh-copy pt3 pb2">
          <FormattedMessage id="rechargeModal.title" />
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
            <FormattedMessage id="rechargeModal.inputLabel" />
          </div>

          <div className="w-70 center">
            <TextInput
              value={amountInput}
              type="currency"
              alignCenter
              className="f2dot5 fw4"
              onChange={this.handleAmountInputChange}
            />
          </div>

          <div className="w-80 center mt4">
            <button
              className={generateRechargeButtonClasses}
              onClick={this.handleGenerateRecharge}
            >
              <FormattedMessage id="rechargeModal.generateRecharge" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderOutcomeRecharge = (
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
        <FormattedMessage id="rechargeModal.title" />
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
          <FormattedMessage id="rechargeModal.validUntil" />
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
            <FormattedMessage id="rechargeModal.instructions" />
          </div>

          <div className="ph3 mv3 f6 b" ref={this.handleBankslipRef}>
            {generated.bankslip}
          </div>

          <button className={copyButtonClasses} onClick={this.handleCopy}>
            <FormattedMessage
              id={`rechargeModal.${hasCopied ? 'copied' : 'copy'}`}
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
                    id={`rechargeModal.${
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
                    id={`rechargeModal.${
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
    const { recharge } = this.props;
    const { isOpen } = recharge;

    if (!isOpen) {
      return null;
    }

    const {
      amountInput,
      minAmount,
      isSubmitting,
      generated,
      hasCopied,
      isSendingEmail,
      hasSentEmail,
      isSendingSMS,
      hasSentSMS,
      errorState,
    } = recharge;

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw5dot5-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const commonButtonClasses =
      'button-reset db w-100 ph2 pv2dot7 br2 fw4 f7dot5 pointer';

    const generateRechargeButtonClasses = `
      ${commonButtonClasses} bn bg-pismo-silver pismo-darker
      ${amountInput >= minAmount ? '' : 'o-50 noclick'}
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

    let content = this.renderLoaderRecharge();

    if (isSubmitting) {
      content = this.renderLoaderRecharge();
    } else if (errorState) {
      content = this.renderErrorStateRecharge();
    } else if (!generated || !generated.bankslip) {
      content = this.renderFormRecharge(
        amountInput,
        minAmount,
        generateRechargeButtonClasses,
      );
    } else {
      content = this.renderOutcomeRecharge(
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
  { customer, recharge, credentials, ui, org },
  props,
) => ({
  customer,
  recharge,
  credentials,
  ui,
  org,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(RechargeModal));
