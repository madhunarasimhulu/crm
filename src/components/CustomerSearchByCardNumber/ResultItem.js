import React, { PureComponent } from 'react';
import UserAvatar from 'react-user-avatar';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import { possibleAvatarColors } from '../../constants';
import { GenericModal } from '..';
import {
  openModal,
  closeModal,
  setModalSubmitting,
  deleteCard,
  showToast,
  setModalOutcome,
} from '../../actions';
import { getRequestErrorMessage } from '../../utils';

import './ResultItem.scss';

class CustomerSearchResultItem extends PureComponent {
  translate = (id) => this.props.intl.formatMessage({ id });

  openModalToConfirmDelete = () => {
    const { dispatch, customer } = this.props;
    const uniqueModalId = `${customer.account_number}${customer.printed_name}${customer.last_4_digits}`;
    dispatch(openModal(uniqueModalId));
  };

  handleClose = () => this.props.dispatch(closeModal());

  deleteAccountCard = (event) => {
    event.preventDefault();

    const { dispatch, credentials, customer } = this.props;

    dispatch(setModalSubmitting());
    dispatch(
      deleteCard(
        {
          programType: null,
          accountId: customer.account_id,
          cardId: customer.card_id,
        },
        credentials,
      ),
    )
      .then(() => dispatch(setModalOutcome('success')))
      .then(() => {
        setTimeout(() => {
          dispatch(showToast(this.translate('cards.newCard.delete.success')));
        }, 1200);
      })
      .catch((err) => {
        dispatch(setModalOutcome('failure'));
        dispatch(
          showToast({
            message:
              getRequestErrorMessage(err) ||
              this.translate('cards.newCard.delete.failure'),
            style: 'error',
          }),
        );
      });
  };

  render() {
    const { isOpen, idOpen } = this.props.modal;
    const { customer } = this.props;
    const modalId = `${customer.account_number}${customer.printed_name}${customer.last_4_digits}`;

    const containerClasses =
      'pv3 bb b--pismo-mid-gray no-underline CustomerSearchResultItem';

    const nameParts = customer.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const fullName = `${firstName} ${lastName}`;

    const issuerInfo = customer.issuer_card ? (
      <FormattedMessage id="cards.params.true" />
    ) : (
      '-'
    );

    return (
      <div>
        <article className={containerClasses}>
          <div className="flex flex-row f6">
            <div className="w-40 flex flex-row pl2-ns">
              <UserAvatar
                size="42"
                name={fullName}
                colors={possibleAvatarColors}
              />
              <div className="flex flex-column self-center ph3-ns">
                <span className="mb1" data-testid="card-test-name">
                  {fullName}
                </span>
                <span className="acc-number pismo-light-silver">
                  {customer.account_number}
                </span>
              </div>
            </div>
            <div className="w-25 self-center tc">{issuerInfo}</div>
            <div className="w-34 flex flex-row self-center pr2-ns">
              <FormattedDate
                value={customer.associate_date}
                day="2-digit"
                month="short"
                year="numeric"
              />
              <div
                className="m0-mr-auto underline-l pismo-pink pointer ttl"
                tabIndex={0}
                // onClick={this.openModalToConfirmDelete}

                data-testid="button-delete-test"
              >
                <FormattedMessage id="card.delete" />
              </div>
            </div>
          </div>
        </article>

        {isOpen && idOpen === modalId && (
          // <GenericModal
          //   title="card.delete"
          //   onClose={this.handleClose}
          //   onSubmit={this.deleteAccountCard}
          // >
          //   <div className="w-80 center" data-testid="modal-delete-test">
          //     <p className="mb3">
          //       <FormattedMessage id="cards.deleteCard.confirm" />
          //       <br />
          //       <FormattedMessage id="areYouSure" />
          //     </p>

          //     <div className="pv3">
          //       <div className="normal">
          //         <FormattedMessage id="card" />{' '}
          //         {customer.name || <FormattedMessage id="creditcard" />} - (
          //         <FormattedMessage id="card.virtual" />)
          //       </div>
          //       <h1 className="f3 ttu pismo-darker-blue ma0 pa0 pv2">
          //         <div>{customer.printed_name || ''}</div>
          //         <div>**** **** **** {customer.last_4_digits || '****'}</div>
          //       </h1>
          //     </div>
          //   </div>
          // </GenericModal>
          <></>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ ui, customer, modal, credentials }, props) => ({
  isMobile: ui.isMobile,
  customer,
  modal,
  credentials,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(CustomerSearchResultItem));
