import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

import './RoundedModal.scss';

class RoundedModal extends Component {
  static defaultProps = {
    isSubmitting: false,
  };

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    outcome: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = (event) => this.props.onSubmit(event);

  handleClose = () => this.props.onClose();

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { modal, children } = this.props;
    const { isSubmitting, outcome } = modal;
    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-100 mw6-ns center-ns bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6 ttu',
      {
        ttu: !outcome,
        'bg-pismo-dark-gray noclick': isSubmitting && !outcome,
        'bg-pismo-transparent pismo-dark-blue pointer':
          !isSubmitting && !outcome,
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
          <div
            data-testid={this.props['data-testid']}
            className={`${overlayClasses} ${fadeInStates[state]}`}
          >
            <form
              name="cardUnblockForm"
              className="dtc v-mid"
              onSubmit={this.handleSubmit}
            >
              <div
                className={`${modalClasses} modal-rounded`}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="pv4 fw4 f6 tc modal-rounded-content">
                  {children}
                </div>

                <div className="modal-rounded-actions">
                  <button
                    data-testid={`${this.props['data-testid']}.cancelButton`}
                    type="button"
                    className="button-reset br0 bn fw4 db w-100 pa3 f6 ttu bg-pismo-transparent pismo-dark-blue pointer"
                    onClick={this.handleClose}
                  >
                    {this.translate('cancel')}
                  </button>
                  <button
                    data-testid={`${this.props['data-testid']}.submitButton`}
                    type={
                      isSubmitting || outcome === 'success'
                        ? 'button'
                        : 'submit'
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
              </div>
            </form>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = ({ modal, cardUnblock, intl }, props) => ({
  intl,
  modal,
  cardUnblock,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(RoundedModal));
