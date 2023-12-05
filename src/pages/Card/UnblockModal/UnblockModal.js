import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';
import { closeCardUnblock } from '../../../actions';

class UnblockModal extends Component {
  static defaultProps = {
    isOpen: false,
    isSubmitting: false,
    card: {},
  };

  static propTypes = {
    card: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    outcome: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = (event) => this.props.onSubmit(event);

  handleClose = () => this.props.dispatch(closeCardUnblock());

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { card, cardUnblock } = this.props;
    const { printed_name, last_4_digits } = card;
    const { isOpen, isSubmitting, outcome } = cardUnblock;

    if (!isOpen) {
      return null;
    }

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw6-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6 ttu',
      {
        ttu: !outcome,
        'bg-pismo-dark-gray noclick': isSubmitting && !outcome,
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
              onSubmit={this.handleSubmit}
            >
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  <FormattedMessage id="unblock" />
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

                <div className="pv4 fw4 f6 tc">
                  <div>
                    <FormattedMessage id="cards.unblockTitle" />
                  </div>

                  <h1 className="f3 ttu pismo-darker-blue ma0 pa0 pv3">
                    <div>{printed_name || ''}</div>
                    <div>**** **** **** {last_4_digits || '****'}</div>
                  </h1>
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

const mapStateToProps = ({ card, cardUnblock, intl }, props) => ({
  intl,
  card,
  cardUnblock,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(UnblockModal));
