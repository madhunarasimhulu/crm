import React, { Component } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';
import { setCardParamValue } from '../../../actions';
import { Label, Loader, TextInput } from '../../../components/commons';

const inputClasses = `
  input-reset
  db w-100 pa2dot5
  bb bw1
  pismo-near-black bg-pismo-light-gray b--pismo-gray
  hover-bg-white hover-b--pismo-near-black
  hover-shadow-pismo-1
  f4
  animate-all
  Input
`;

class EditParamModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limitError: '',
    };
  }

  handleCurrencyChange = (event, value, maskedValue) => {
    const { cardEditParam, dispatch, customer } = this.props;

    const { param } = cardEditParam;

    this.setState({
      limitError:
        value > customer?.limits?.max_credit_limit
          ? 'The Transaction limit entered is more than the credit limit'
          : '',
    });

    dispatch(
      setCardParamValue({
        name: param.name,
        value,
      }),
    );
  };

  handleTextChange = (event) => {
    const { cardEditParam, dispatch } = this.props;
    const { param } = cardEditParam;

    dispatch(
      setCardParamValue({
        name: param.name,
        value: event.target.value,
      }),
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { cardEditParam, onSubmit, customer } = this.props;
    const { param } = cardEditParam;

    if (param.type === 'currency') {
      if (param.value > customer?.limits?.max_credit_limit) {
        this.setState({
          limitError:
            'The Transaction limit entered is more than the credit limit',
        });
      } else {
        this.setState({
          limitError: '',
        });
        return onSubmit(event, param);
      }
    } else {
      this.setState({
        limitError: '',
      });
      return onSubmit(event, param);
    }
  };

  handleClose = () => {
    this.props.onClose();
    this.setState({
      limitError: '',
    });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { cardEditParam } = this.props;
    const { isOpen, isSubmitting, outcome, param } = cardEditParam;

    if (!isOpen) {
      return null;
    }

    const isLoading = !param.name;

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw5dot5-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6 ttu',
      {
        ttu: !outcome,
        'bg-pismo-dark-gray noclick':
          (isSubmitting || param.value < 1) && !outcome,
        'bg-pismo-yellow pointer': !isSubmitting && !outcome,
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

    return (
      <Transition timeout={50} appear in>
        {(state) => (
          <div className={`${overlayClasses} ${fadeInStates[state]}`}>
            <form
              name="cardUnblockForm"
              className="dtc v-mid"
              // onSubmit={this.handleSubmit}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  <FormattedMessage id="cards.editParam" />
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

                {!isLoading ? (
                  <div className="pv5 f6 tc w-60 center">
                    <div className="pv2 mb1 f4 fw4">
                      <FormattedMessage id={`cards.params.${param.name}`} />:
                    </div>

                    {param.type === 'currency' ? (
                      <>
                        <TextInput
                          type="currency"
                          value={param.value}
                          alignCenter
                          className="f4"
                          onChange={this.handleCurrencyChange}
                        />
                        <Label style={{ color: 'red' }}>
                          {this.state.limitError}
                        </Label>
                      </>
                    ) : (
                      <input
                        name={param.name}
                        type="text"
                        className={inputClasses}
                        value={param.value}
                        maxLength={param.maxLength}
                        onChange={this.handleTextChange}
                      />
                    )}
                  </div>
                ) : (
                  <div className="pv5 f6 tc">
                    <Loader size="large" />
                  </div>
                )}

                {!isLoading && (
                  <button
                    type={
                      isSubmitting || outcome === 'success'
                        ? 'button'
                        : 'submit'
                    }
                    className={`${submitBtnClasses} ${
                      this.state.limitError != ''
                        ? 'bg-pismo-dark-gray noclick'
                        : ''
                    }`}
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
                )}
              </div>
            </form>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = (
  { card, cardEditParam, intl, org, customer },
  props,
) => ({
  intl,
  card,
  cardEditParam,
  org,
  customer,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(EditParamModal));
