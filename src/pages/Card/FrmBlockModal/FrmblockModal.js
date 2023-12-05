import { Component } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import { MdClose } from 'react-icons/md';
import { injectIntl, FormattedMessage } from 'react-intl';

class FrmblockModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      isSubmitting: false,
    };
  }

  handleSubmit = (event) => this.props.onSubmit(event);

  handleSubmitButtonClasses = () => {
    const { isSubmitting } = this.props;

    return !isSubmitting
      ? 'bg-pismo-yellow pointer button-reset br0 bn white fw4 db w-100 pa3 f6 ttu'
      : 'bg-pismo-dark-gray noclick button-reset br0 bn white fw4 db w-100 pa3 f6 ttu';
  };

  render() {
    const { card, isOpen, isSubmitting, frm_block } = this.props;
    const { name, printed_name, last_4_digits } = card;

    if (!isOpen) {
      return <></>;
    }

    const overlayClasses =
      'fixed w-100 h-100 top-0 left-0 dt bg-black-70 z-9999 animate-all';
    const modalClasses =
      'relative w-99 mw6-ns center bg-pismo-near-white pismo-darker-blue br1-ns animate-all';

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
              // name="cardUnblockForm"
              className="dtc v-mid"
              onSubmit={this.handleSubmit}
            >
              <div
                className={modalClasses}
                style={{ transform: `scale(${growStates[state]})` }}
              >
                <div className="tc b lh-copy pt3 f6 pb2">
                  {String(frm_block).toUpperCase() === 'N' ? (
                    <FormattedMessage id={'cards.frmBlock'} />
                  ) : (
                    <FormattedMessage id={'cards.frmUnBlock'} />
                  )}
                </div>

                <div
                  className="absolute top-0 right-1 mt1"
                  style={{ marginTop: '12px' }}
                >
                  <button
                    type="button"
                    className="button-reset bn bg-transparent pointer f4"
                    onClick={() => {
                      this.props.handleModalClose();
                    }}
                  >
                    <MdClose />
                  </button>
                </div>

                <div className="pv4 fw4 f6 tc">
                  <div>
                    {String(frm_block).toUpperCase() === 'N' ? (
                      <FormattedMessage id={`Confirm FRM Card Blocking`} />
                    ) : (
                      <FormattedMessage id={`Confirm FRM Card Unblocking`} />
                    )}
                  </div>

                  <h1 className="f3 ttu pismo-darker-blue ma0 pa0 pv3">
                    <div>{name || printed_name || ''}</div>
                    <div>**** **** **** {last_4_digits || '****'}</div>
                  </h1>
                </div>

                <button
                  type={
                    // isSubmitting || outcome === 'success' ? 'button' : 'submit'
                    isSubmitting ? 'button' : 'submit'
                  }
                  className={this.handleSubmitButtonClasses()}
                >
                  {isSubmitting ? 'Submitting' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = ({ card, cardTemporaryBlock, intl }, props) => ({
  intl,
  card,
  cardTemporaryBlock,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(FrmblockModal));
