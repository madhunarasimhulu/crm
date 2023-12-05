import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Slider from 'rc-slider/lib/Slider';
import { getRequestErrorMessage } from '../../../utils';
import { limitProposalReasons } from '../../../constants';
import { Select, Loader, TextInput } from '../../../components/commons';
import { cloneDeep } from 'lodash';

import {
  setLimitProposalStatus,
  closeLimitProposal,
  setLimitProposalNextLimit,
  setLimitProposalNextLimitSlider,
  setLimitProposalReason,
  submitLimitProposal,
  showToast,
  setCustomer,
  setCustomerParams,
} from '../../../actions';

import 'rc-slider/assets/index.css';
import { FormatMoney } from '../../../components';
import { Accounts } from 'clients';

class LimitProposalModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: this.props.nextLimitSlider,
    };
  }

  static propTypes = {
    limitProposal: PropTypes.shape({
      status: PropTypes.object,
      isOpen: PropTypes.bool,
      nextLimit: PropTypes.number,
      nextLimitSlider: PropTypes.number,
      isLoading: PropTypes.bool,
      isSubmitting: PropTypes.bool,
      outcome: PropTypes.string,
      selectedReason: PropTypes.string,
    }),
    currentLimit: PropTypes.number,
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { limitProposal, credentials, customer, dispatch } = this.props;
    const {
      accountId: account_id,
      credit_limits: { max: max_limit },
    } = customer;
    const { nextLimit, selectedReason } = limitProposal;
    const translationPrefix = 'profile.limit.outcome';

    const body = {
      new_limit: nextLimit,
      reason: selectedReason,
    };

    return dispatch(
      submitLimitProposal(account_id, body, max_limit, credentials),
    )
      .then(async () => {
        // Creating copy of customers and dispatching with new limit

        //

        await Accounts.getAccountLimits(customer?.accountId, credentials)
          .then((response) => {
            let newCustomer = cloneDeep(customer);
            newCustomer['credit_limits']['available'] =
              response?.available_credit_limit;
            newCustomer['credit_limits']['total'] = nextLimit;
            newCustomer['limits'] = response;
            let newCreditLimits = cloneDeep(newCustomer['credit_limits']);

            dispatch(setCustomer({ ...newCustomer }));
            dispatch(
              setCustomerParams({
                ...newCustomer?.contract,
                ...newCreditLimits,
                ...newCustomer?.account,
              }),
            );
          })
          .catch((e) => {
            dispatch(
              showToast({
                message: `Failed to fetch the Account limits`,
                style: 'error',
              }),
            );
          });

        window.setTimeout(() => {
          this.handleClose();
          dispatch(showToast(this.translate(`${translationPrefix}.success`)));
        }, 1200);
      })
      .catch((err) =>
        window.setTimeout(() => {
          const msg = getRequestErrorMessage(err);

          this.handleClose();
          dispatch(
            showToast({
              message: msg || this.translate(`${translationPrefix}.failure`),
              style: 'error',
            }),
          );
        }, 1200),
      );
  };

  handleChange = (event, nextValue) => {
    const { dispatch, customer } = this.props;
    const {
      credit_limits: { max: max_limit },
    } = customer;
    const safeValue = nextValue <= max_limit ? nextValue : max_limit;

    dispatch(setLimitProposalNextLimit({ nextValue }));
    dispatch(setLimitProposalNextLimitSlider({ nextValue: safeValue }));
  };

  handleNextLimitSliderChange = (value) => {
    const { customer, dispatch } = this.props;
    const {
      credit_limits: { max: max_limit },
    } = customer;
    const nextValue = value < max_limit ? Math.floor(value) : max_limit;
    this.setState({ sliderValue: nextValue });
    dispatch(setLimitProposalNextLimitSlider({ nextValue }));
    dispatch(setLimitProposalNextLimit({ nextValue }));
  };

  handleClose = () => {
    this.props.dispatch(closeLimitProposal());
  };

  handleReasonSelect = (event) => {
    this.props.dispatch(setLimitProposalReason(event.target.value));
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleKeyDown = (event) => {
    const { keyCode } = event;
    const {
      limitProposal: { isOpen },
    } = this.props;

    if (keyCode !== 27 || !isOpen) {
      return false;
    }

    return this.handleClose();
  };

  handleCurrencyInputRef = (el) => {
    this.currencyInputEl = el;
  };

  componentDidUpdate(prevProps) {
    const {
      currentLimit: previousLimit,
      limitProposal: prevLimitProposal,
      customer: prevCustomer,
    } = prevProps;
    const { isOpen: wasOpen } = prevLimitProposal;
    const { accountId: prevAccountId } = prevCustomer;

    const { currentLimit, limitProposal, customer, dispatch } = this.props;
    const { isOpen, nextLimit, selectedReason } = limitProposal;
    const { accountId, credit_limits } = customer;
    const { max: maxLimit } = credit_limits;

    const inputEl = this.currencyInputEl;

    if (prevAccountId !== accountId || (!wasOpen && isOpen)) {
      dispatch(setLimitProposalStatus());
      window.addEventListener('keydown', this.handleKeyDown);
    }

    if (previousLimit !== currentLimit) {
      dispatch(
        setLimitProposalNextLimit({
          nextValue: currentLimit || 0,
        }),
      );
    }

    if (inputEl && inputEl.input.value !== nextLimit) {
      inputEl.setMaskedValue(nextLimit);
    }

    if (nextLimit <= maxLimit && selectedReason.length > 0) {
      dispatch(setLimitProposalReason(''));
    }
  }

  componentDidMount() {
    const { isOpen, currentLimit, dispatch } = this.props;

    if (isOpen) {
      dispatch(setLimitProposalStatus());
      window.addEventListener('keydown', this.handleKeyDown);
    }

    if (currentLimit) {
      dispatch(
        setLimitProposalNextLimit({
          nextValue: currentLimit,
        }),
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { limitProposal, currentLimit, customer } = this.props;
    const {
      credit_limits: { max: max_limit },
    } = customer;
    const {
      isOpen,
      isLoading,
      isSubmitting,
      nextLimit,
      nextLimitSlider,
      outcome,
      selectedReason,
    } = limitProposal;

    if (!isOpen) {
      return null;
    }
    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw5dot5-ns center bg-pismo-near-white pismo-darker-blue br1-ns shadow-2 animate-all';

    const inputClasses = `
      input-reset f2 tc
    `;

    const middleBodyClasses = `
      pt2 pb4 mt3
      bg-pismo-lighter-gray
      ${nextLimit > max_limit ? 'o-100 h-auto' : 'o-0 h3 noclick'}
      animate-all
    `;

    const disclaimerClasses = `
      pv1 f6 fw4 pismo-dark-blue
      ${nextLimit > max_limit ? 'h-auto mt3 o-100' : 'h2 mt0 o-0'}
      animate-all
    `;

    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6',
      {
        ttu: !outcome,
        'bg-pismo-dark-gray noclick':
          !nextLimit ||
          nextLimit === currentLimit ||
          (isSubmitting && !outcome) ||
          (selectedReason.length <= 0 && nextLimit > max_limit),
        'bg-pismo-yellow pointer':
          !isSubmitting &&
          !outcome &&
          ((nextLimit > max_limit && selectedReason.length > 0) ||
            (nextLimit <= max_limit && selectedReason.length <= 0)),
        'bg-red noclick': outcome === 'failure',
        'bg-green noclick': outcome === 'success',
      },
    );

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

    if (isLoading) {
      return (
        <Transition timeout={50} appear in>
          {(state) => (
            <div className={`${overlayClasses} ${fadeInStates[state]}`}>
              <form
                name="disputeReasonForm"
                className="dtc v-mid"
                // onSubmit={this.handleSubmit}
                onSubmit={() => {}}
              >
                <div
                  className={modalClasses}
                  style={{ transform: `scale(${growStates[state]})` }}
                >
                  <div className="tc b lh-copy pt3 f6 pb2">
                    <FormattedMessage id="profile.limitProposal" />
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

                  <div className="pv5">
                    <Loader />
                  </div>
                </div>
              </form>
            </div>
          )}
        </Transition>
      );
    }

    return (
      <Transition timeout={50} appear in>
        {(state) => (
          <div className={`${overlayClasses} ${fadeInStates[state]}`}>
            <form
              name="disputeReasonForm"
              className="dtc v-mid"
              // onSubmit={this.handleSubmit}
              onSubmit={() => {}}
            >
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  <FormattedMessage id="profile.limitProposal" />
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

                <div className="pt4 f5 fw4 tc">
                  <TextInput
                    type="currency"
                    alignCenter
                    className={`${inputClasses} w-70 center tc`}
                    value={nextLimit}
                    disabled
                    sliderValue={this.state.sliderValue}
                    // onChange={this.handleChange}
                    onChange={() => {}}
                  />

                  <div
                    className={`pismo-light-silver f5 fw4 mt2 ${
                      nextLimit && currentLimit !== nextLimit ? 'o-100' : 'o-0'
                    } animate-all`}
                  >
                    <FormattedMessage id="profile.currentLimit" />
                    :&nbsp;
                    <FormatMoney value={currentLimit} />
                  </div>

                  <div
                    className={`pv2 mt2 w-70 center ${
                      nextLimitSlider > max_limit ? 'o-50' : ''
                    }`}
                  >
                    <div className="pismo-mid-gray">
                      <div className="dib v-mid w-50 tl">
                        <FormatMoney value={0} />
                      </div>
                      <div className="dib v-mid w-50 tr">
                        <FormatMoney value={max_limit} />
                      </div>
                    </div>

                    <Slider
                      min={0}
                      max={max_limit}
                      step={0.01}
                      defaultValue={parseInt(nextLimitSlider, 10)}
                      value={parseInt(nextLimitSlider, 10)}
                      onChange={() => {}}
                      // onChange={this.handleNextLimitSliderChange}
                    />
                  </div>

                  <div className={middleBodyClasses}>
                    <div className="w-75-ns w-80 center">
                      <div className={disclaimerClasses}>
                        <FormattedMessage id="profile.limitProposal.exceedMaxLimitDisclaimer" />
                      </div>
                    </div>

                    <div
                      className={`w-75-ns w-90 center mt3 ${
                        nextLimit > max_limit ? 'o-100' : 'o-0'
                      } animate-all`}
                    >
                      <Select
                        name="limitProposalReason"
                        value={selectedReason}
                        // onChange={this.handleReasonSelect}
                        onChange={() => {}}
                        required={nextLimit > max_limit}
                      >
                        <option value="" disabled>
                          {this.translate('profile.limitProposal.selectReason')}
                        </option>
                        {limitProposalReasons.map(
                          ({ name: reasonName, value: reasonValue }, index) => (
                            <option value={reasonValue} key={reasonName}>
                              {this.translate(
                                `profile.limitProposal.reasons.${reasonName}`,
                              )}
                            </option>
                          ),
                        )}
                      </Select>
                    </div>
                  </div>
                </div>

                <button
                  type={
                    isSubmitting || outcome === 'success' ? 'button' : 'submit'
                  }
                  className={submitBtnClasses}
                >
                  {this.translate(
                    isSubmitting
                      ? 'submitting'
                      : outcome
                      ? outcome === 'success'
                        ? 'submitted'
                        : 'failedToSubmit'
                      : 'confirm',
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = (
  {
    credentials,
    limitProposal,
    limitProposalInformation,
    ui,
    customer,
    routeWatcher,
    org,
  },
  props,
) => ({
  credentials,
  limitProposal,
  limitProposalInformation,
  ui,
  customer,
  routeWatcher,
  org,
  ...props,
});

export default connect(mapStateToProps)(
  injectIntl(withRouter(LimitProposalModal)),
);
