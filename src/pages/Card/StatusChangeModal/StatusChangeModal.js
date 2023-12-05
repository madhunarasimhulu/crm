import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';
import { closeCardStatusChange, setCardSelectedStatus } from '../../../actions';
import { Loader } from '../../../components/commons';

class StatusChangeModal extends Component {
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

  handleSubmit = (event) => {
    const { onSubmit, cardStatusChange } = this.props;
    const { selectedStatus, shouldRecreate } = cardStatusChange;

    return onSubmit(event, selectedStatus, shouldRecreate);
  };

  handleClose = () => this.props.dispatch(closeCardStatusChange());

  translate = (id) => this.props.intl.formatMessage({ id });

  handleStatusSelect = (event) => {
    this.props.dispatch(setCardSelectedStatus(event.target.value));
  };

  render() {
    const { cardStatusChange } = this.props;
    const { isOpen } = cardStatusChange;

    if (!isOpen) return null;

    const { card } = this.props;
    const { printed_name, last_4_digits } = card;
    const { isSubmitting, outcome, statuses, selectedStatus } =
      cardStatusChange;

    const nonDefinitiveStatuses = new Set([
      'created',
      'normal',
      'blocked',
      'pending',
      'warning',
      'inoperative',
    ]);
    const definitiveStatuses = statuses.filter(
      (status) => !nonDefinitiveStatuses.has(status.toLowerCase()),
    );

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw6-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6',
      {
        ttu: !outcome,
        'bg-pismo-dark-gray noclick':
          (isSubmitting || !selectedStatus.length) && !outcome,
        'bg-pismo-yellow pointer':
          !isSubmitting && selectedStatus.length > 0 && !outcome,
        'bg-red noclick': outcome === 'failure',
        'bg-green noclick': outcome === 'success',
      },
    );

    const selectClasses = `
      input-reset
      db w-70 center pa2dot5
      bb bw1
      pismo-near-black bg-pismo-light-gray b--pismo-gray
      hover-bg-white hover-b--pismo-near-black
      hover-shadow-pismo-1
      animate-all
      pointer
      br0
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
                  <FormattedMessage id="block" />
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
                    <FormattedMessage id="cards.statusChangeTitle" />
                  </div>

                  <h1 className="f3 ttu pismo-darker-blue ma0 pa0 pv4">
                    <div>{printed_name || ''}</div>
                    <div>**** **** **** {last_4_digits}</div>
                  </h1>

                  {!statuses || !statuses.length ? (
                    <Loader size="small" />
                  ) : (
                    <select
                      className={selectClasses}
                      name="cardStatus"
                      value={selectedStatus}
                      onChange={this.handleStatusSelect}
                      required
                    >
                      <option value="" disabled>
                        {this.translate('cards.selectStatus')}
                      </option>
                      {definitiveStatuses.map((status) => (
                        <option value={status} key={status}>
                          {this.translate(`cards.statuses.${status}`)}
                        </option>
                      ))}
                    </select>
                  )}
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

const mapStateToProps = ({ card, cardStatusChange, intl }, props) => ({
  intl,
  card,
  cardStatusChange,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(StatusChangeModal));
