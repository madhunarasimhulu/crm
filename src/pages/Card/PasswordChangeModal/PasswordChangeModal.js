import React, { Component } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import { MdClose, MdCancel } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextInput } from 'components/commons';
import OtpInputBoxes from 'components/OtpInputBoxes';

class PasswordChangeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newPin: null,
      newPinConfirmation: null,
      newPinError: null,
      newPinConfirmationError: null,
      newPinConfirmPinMismatchError: null,
      otp: {
        num1: '',
        num2: '',
        num3: '',
        num4: '',
        num5: '',
        num6: '',
      },
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { onSubmit } = this.props;

    return onSubmit(event, this.state.newPin, this.state.otp, () => {
      this.setState({
        newPin: null,
        newPinConfirmation: null,
        newPinError: null,
        newPinConfirmationError: null,
        newPinConfirmPinMismatchError: null,
        otp: {
          num1: '',
          num2: '',
          num3: '',
          num4: '',
          num5: '',
          num6: '',
        },
      });
    });
  };

  handleOtpGeneration = (event) => {
    event.preventDefault();
    const { generateOtp } = this.props;

    const { newPin, newPinConfirmation } = this.state;

    this.setState({
      newPinError: null,
      newPinConfirmationError: null,
      newPinConfirmPinMismatchError: null,
    });

    if (!newPin) {
      this.setState({ newPinError: this.translate('cards.emptyPinError') });
      return;
    }
    if (!newPinConfirmation) {
      this.setState({
        newPinConfirmationError: this.translate('cards.emptyPinError'),
      });
      return;
    }

    if (newPin.length < 4) {
      this.setState({ newPinError: this.translate('cards.pinMinlengthError') });
      return;
    }

    if (newPinConfirmation.length < 4) {
      this.setState({
        newPinConfirmationError: this.translate('cards.pinMinlengthError'),
      });
      return;
    }

    if (newPin !== newPinConfirmation) {
      this.setState({
        newPinConfirmPinMismatchError: this.translate('cards.pinMatchError'),
      });

      return;
    }

    return generateOtp(event);
  };

  handleClose = () => {
    this.props.onClose();
    this.setState({
      newPin: null,
      newPinConfirmation: null,
      newPinError: null,
      newPinConfirmationError: null,
      otp: {
        num1: '',
        num2: '',
        num3: '',
        num4: '',
        num5: '',
        num6: '',
      },
    });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleInputChange = (ev, field) => {
    const value = ev.target.value;

    if (value.match(/\D/gi)) {
      return;
    }
    this.setState({ [field]: value });
  };

  handleOtpChange = (event) => {
    if (event.target.value < 10) {
      this.setState({
        ...this.state,
        otp: {
          ...this.state.otp,
          [event.target.name]: event.target.value,
        },
      });
    }
  };

  render() {
    const { cardPasswordChange } = this.props;
    const { isOpen, isSubmitting, showOtpField } = cardPasswordChange;

    if (!isOpen) {
      return null;
    }

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw6-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const submitBtnClasses =
      isSubmitting ||
      this.props.btnDisabled ||
      this.props.disabled ||
      (showOtpField &&
        Object.values(this.state.otp)
          .reduce((a, b) => a + b)
          .trim().length !== 6)
        ? 'bg-pismo-dark-gray noclick'
        : 'bg-pismo-yellow pointer';

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

    return (
      <Transition timeout={50} appear in>
        {(state) => (
          <div className={`${overlayClasses} ${fadeInStates[state]}`}>
            <form
              name="cardUnblockForm"
              className="dtc v-mid"
              onSubmit={
                showOtpField ? this.handleSubmit : this.handleOtpGeneration
              }
            >
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  <FormattedMessage id="cards.pinChange" />
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

                <div className="pv4 fw4 f6">
                  {!showOtpField ? (
                    <>
                      <div>
                        <div style={{ display: 'flex' }}>
                          <div className="dib w-100 w-50-ns pb3 pb1-ns ph1">
                            <TextInput
                              id="new_pin"
                              type="password"
                              label={this.translate('cards.newPin')}
                              placeholder={this.translate('cards.newPin')}
                              maxLength={4}
                              value={this.state.newPin}
                              onChange={(ev) =>
                                this.handleInputChange(ev, 'newPin')
                              }
                              error={this.state.newPinError}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="dib w-100 w-50-ns pb3 pb1-ns ph1">
                            <TextInput
                              id="new_pin_confirmation"
                              type="password"
                              label={this.translate('cards.newPinConfirmation')}
                              placeholder={this.translate(
                                'cards.newPinConfirmation',
                              )}
                              maxLength={4}
                              value={this.state.newPinConfirmation}
                              onChange={(ev) =>
                                this.handleInputChange(ev, 'newPinConfirmation')
                              }
                              error={this.state.newPinConfirmationError}
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>

                        <div className="Pin-error-msg-div">
                          {this.state.newPinConfirmPinMismatchError ? (
                            <center>
                              <div className="Pin-error-msg">
                                <div
                                  style={{
                                    marginTop: '-3px',
                                  }}
                                >
                                  <MdCancel />
                                </div>
                                &nbsp;&nbsp;
                                <div>
                                  <label>
                                    {this.state.newPinConfirmPinMismatchError}
                                  </label>
                                </div>
                              </div>
                            </center>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <OtpInputBoxes
                      id="change-pin-otp"
                      label="Please enter OTP"
                      otp={this.state.otp}
                      handleOtpChange={this.handleOtpChange}
                      error={this.props.error}
                      disabled={this.props.disabled}
                    />
                  )}
                </div>
                <button
                  type={isSubmitting ? 'button' : 'submit'}
                  className={`button-reset br0 bn white fw4 db w-100 pa3 f6 ttu ${submitBtnClasses}`}
                  disabled={
                    this.props.disabled ||
                    this.props.btnDisabled ||
                    (showOtpField &&
                      Object.values(this.state.otp)
                        .reduce((a, b) => a + b)
                        .trim().length !== 6)
                  }
                >
                  {this.translate(isSubmitting ? 'submitting' : 'confirm')}
                </button>
              </div>
            </form>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = ({ card, cardPasswordChange, intl }, props) => ({
  intl,
  card,
  cardPasswordChange,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(PasswordChangeModal));
