import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';
import { FormatMoney } from '../../../components';

class ConfirmationModal extends Component {
  static defaultProps = {
    isOpen: false,
    isLoading: false,
    data: {},
  };

  static propTypes = {
    data: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    outcome: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    currency: PropTypes.string,
  };

  handleSubmit = (event) => this.props.onSubmit(event);

  handleClose = () => this.props.onClose();

  handleSubmitClick() {
    this.props.onSubmitClickHandler && this.props.onSubmitClickHandler();
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { isOpen, isLoading, data, outcome, currency } = this.props;
    const { printed_name, name, type, transaction_limit } = data;

    if (!isOpen) {
      return null;
    }

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-100 mw6-ns center-ns bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6',
      {
        ttu: !outcome,
        'bg-pismo-dark-gray noclick': isLoading && !outcome,
        'bg-pismo-yellow pointer': !isLoading && !outcome,
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
              name="disputeReasonForm"
              className="dtc v-mid"
              onSubmit={this.handleSubmit}
            >
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  <FormattedMessage id="cards.form.newCard" />
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

                <div className="pv5 fw4 f6 tc">
                  <div>
                    {type && type.length > 0 && (
                      <div className="f6">
                        <FormattedMessage id={`cards.types.${type}`} />
                      </div>
                    )}

                    {(!type || type.length <= 0) && (
                      <FormattedMessage id="creditcard" />
                    )}
                  </div>

                  <h1 className="f3 ttu pismo-darker-blue ma0 pa0 pv1">
                    {printed_name || name || ''}
                  </h1>
                  {transaction_limit && (
                    <div className="f4 mt1">
                      <span className="fw4">{currency} </span>
                      <span className="b">
                        <FormatMoney value={transaction_limit || 0} />
                      </span>
                      &nbsp;/&nbsp;
                      <span className="ttl">
                        {this.translate('transaction')}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type={
                    isLoading || outcome === 'success' ? 'button' : 'submit'
                  }
                  onClick={this.handleSubmitClick.bind(this)}
                  className={submitBtnClasses}
                >
                  {this.translate(
                    isLoading
                      ? 'submitting'
                      : outcome === 'success'
                      ? 'submitted'
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

export default injectIntl(ConfirmationModal);
