import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';

class SimpleModal extends Component {
  static defaultProps = {
    isOpen: false,
  };

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
  };

  preventStop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleClose = (e) => {
    this.preventStop(e);
    if (this.props.onClose) {
      return this.props.onClose();
    }
  };

  handleKeyDown = (event) => {
    const { keyCode } = event;

    const callbackMap = {
      27: this.handleClose, // esc
    };

    const callback = callbackMap[keyCode];

    if (!callback || typeof callback !== 'function') {
      return false;
    }

    return callback();
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { title, customClasses, childrenContainerClasses, children } =
      this.props;
    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-100 mw6-ns center-ns bg-pismo-near-white pismo-darker-blue br1-ns animate-all';
    const extraClasses = customClasses || '';
    const childrenClasses = childrenContainerClasses || 'pv4 fw4 f6';

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
            className={`${overlayClasses} ${fadeInStates[state]}`}
            onClick={this.handleClose}
          >
            <div className="dtc v-mid">
              <div
                className={`${modalClasses} ${extraClasses}`}
                style={{ transform: `scale(${growStates[state]})` }}
                onClick={this.preventStop}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  <FormattedMessage id={title} />
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

                <div className={childrenClasses}>{children}</div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = ({ ui }, props) => ({
  ui,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(SimpleModal));
