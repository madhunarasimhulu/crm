/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import { MdKeyboardBackspace } from 'react-icons/md';
import { MdRemoveRedEye } from 'react-icons/md';
import { MdRemoveCircle } from 'react-icons/md';
import { Wallet } from '../../clients';
import get from 'lodash.get';
import {
  getRequestErrorMessage,
  vh100SafeCSSClass,
  formatCPFCNPJ,
  isCardsOnFileOperator,
} from '../../utils';
import {
  CustomerPageWrapper,
  NavBar,
  GenericModal,
  FormatMoney,
} from '../../components';
import { ActionButton, Loader } from '../../components/commons';
import { EditParamModal, UnblockModal } from '.';

import {
  showToast,
  openCardEditParam,
  closeCardEditParam,
  updateCard,
  setCardEditParamOutcome,
  setCardEditParamSubmitting,
  deleteCard,
  setModalSubmitting,
  openModal,
  closeModal,
  setModalOutcome,
  resetCard,
  getPCICardInfo,
  openCardUnblock,
  setCardUnblockOutcome,
  setCard,
  setCardUnblockSubmitting,
  closeCardUnblock,
} from '../../actions';

import mastercardIcon from '../../assets/icons/mastercard.svg';
import visaIcon from '../../assets/icons/visa.svg';
import amexIcon from '../../assets/icons/amex.svg';

import './Card.scss';

const cardNetworkLogos = {
  MASTERCARD: mastercardIcon,
  VISA: visaIcon,
  AMEX: amexIcon,
};

class CardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHoveringCard: false,
      isSensitiveInfoShown: false,
      isRevealDataTooltipShown: false,
    };
  }

  handleCardMouseEnter = () => {
    const { ui, user, card } = this.props;
    const { isMobile } = ui;
    const { isCustomer } = user;
    const { type: cardType } = card;

    if (isMobile || !isCustomer || cardType === 'PLASTIC') {
      return false;
    }

    this.setState({
      isHoveringCard: true,
    });
  };

  handleCardMouseLeave = () => {
    const { ui, user, card } = this.props;
    const { isMobile } = ui;
    const { isCustomer } = user;
    const { type: cardType } = card;

    if (isMobile || !isCustomer || cardType === 'PLASTIC') {
      return false;
    }

    this.setState({
      isHoveringCard: false,
    });
  };

  handleCardClick = () => {
    const { card, user, dispatch, credentials } = this.props;
    const { isSensitiveInfoShown } = this.state;
    const { isCustomer } = user;
    const { id: cardId, type: cardType } = card;

    if (!isCustomer || cardType === 'PLASTIC') {
      return false;
    }

    if (isSensitiveInfoShown) {
      this.setState({
        isSensitiveInfoShown: false,
      });
      return null;
    }

    dispatch(getPCICardInfo(cardId, credentials)).then(() => {
      this.setState({
        isSensitiveInfoShown: true,
        isRevealDataTooltipShown: false,
      });

      localStorage.setItem('pismo-hide-reveal-card-tooltip', 'true');
    });
    return null;
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleEditParam = (param) => {
    const { user } = this.props;
    const { isCustomer } = user;
    const { editable } = param;

    if (!isCustomer || !editable) {
      return false;
    }

    return this.props.dispatch(openCardEditParam(param));
  };

  getEditParamHandler = (param) => () => this.handleEditParam(param);

  handleCloseEditParam = () => {
    this.props.dispatch(closeCardEditParam());
  };

  handleParamSubmit = (event, param) => {
    event.preventDefault();

    const { dispatch, credentials, card, user } = this.props;
    const { isCustomer } = user;
    const { id: cardId } = card;
    const { name, value } = param;

    const diff = {
      [name]: value,
    };

    const fields = Object.keys(diff).map((k) =>
      this.translate(`cards.params.${k}`),
    );

    dispatch(setCardEditParamSubmitting(true));
    dispatch(updateCard(cardId, diff, credentials, isCustomer))
      .then(() => {
        dispatch(setCardEditParamOutcome('success'));

        window.setTimeout(() => {
          dispatch(
            showToast(`
            ${fields.join(',')}
            ${this.translate(
              `cards.editParam.success${
                fields.length > 1 ? 'Plural' : 'Singular'
              }`,
            )}
          `),
          );

          this.handleCloseEditParam();
        }, 1000);
      })
      .catch(() => {
        dispatch(setCardEditParamOutcome('failure'));
        window.setTimeout(() => {
          dispatch(
            showToast({
              message: this.translate('cards.editParam.failure'),
              style: 'error',
            }),
          );

          this.handleCloseEditParam();
        }, 1000);
      });
  };

  handleClose = () => {
    this.props.dispatch(closeModal());
  };

  loadPCICardInfo = () => {
    const { location, dispatch, card, credentials } = this.props;
    const { search } = location;
    const { id: cardId, isLoadingCard } = card;

    if (isLoadingCard || !cardId) {
      return false;
    }

    if (/_new/.test(search)) {
      dispatch(getPCICardInfo(cardId, credentials));

      this.setState({
        isSensitiveInfoShown: true,
      });
    }
  };

  goToCardsPage = () => {
    const {
      history,
      match: { params },
    } = this.props;
    const { customerId, accountId } = params;

    return history.push(
      `/customers/${customerId}/accounts/${accountId}/profile/cards`,
    );
  };

  openModalToConfirmDelete = () => {
    const { card, dispatch } = this.props;
    const { type: cardType } = card;

    if (cardType === 'PLASTIC') {
      return false;
    }

    dispatch(openModal());
  };

  goBackToCards = () => {
    const { match, history } = this.props;
    const { customerId, accountId } = match.params;

    history.push(
      `/customers/${customerId}/accounts/${accountId}/profile/cards`,
    );
  };

  deleteAccountCard = (event) => {
    event.preventDefault();

    const { card, dispatch, credentials, customer } = this.props;
    const { id: cardId, type: cardType } = card;

    if (cardType === 'PLASTIC') {
      return false;
    }

    dispatch(setModalSubmitting());
    dispatch(
      deleteCard(
        {
          programType: customer.program.type_name,
          accountId: customer.accountId,
          cardId,
        },
        credentials,
      ),
    )
      .then(() => dispatch(setModalOutcome('success')))
      .then(() => {
        window.setTimeout(() => {
          this.goBackToCards();
        }, 1000);
      })
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

  predictRevealDataTooltipVisibility = () => {
    const { user, card } = this.props;
    const { isCustomer } = user;
    const { type } = card;

    if (!isCustomer || !type || type === 'PLASTIC') {
      return false;
    }

    const value = localStorage.getItem('pismo-hide-reveal-card-tooltip');
    const boolValue = value === 'true';

    this.setState({
      isRevealDataTooltipShown: !boolValue,
    });
  };

  renderFormattedExpirationDate = (value = '') => {
    if (value.length > 4) {
      const parts = value.substr(0, 10).split('-');
      const year = parts[0].substr(2, 4);
      const month = parts[1];

      return `${month}/${year}`;
    }

    const parts = value.match(/.{1,2}/g);

    if (!parts || !parts.length) {
      return '';
    }

    return `${parts[1]}/${parts[0]}`;
  };

  componentDidUpdate(prevProps) {
    const { card: prevCard, user: prevUser } = prevProps;
    const { card, user } = this.props;

    const { id: prevCardId } = prevCard;
    const { id: cardId } = card;
    const { isCustomer: wasCustomer } = prevUser;
    const { isCustomer } = user;

    if ((!prevCardId && cardId) || wasCustomer !== isCustomer) {
      this.loadPCICardInfo();
      this.predictRevealDataTooltipVisibility();
    }
  }

  componentDidMount() {
    this.loadPCICardInfo();
    this.predictRevealDataTooltipVisibility();
  }

  componentWillUnmount() {
    this.props.dispatch(closeModal());
    this.props.dispatch(resetCard());
  }

  handleActivateCard = (event) => {
    event.preventDefault();
    this.props.dispatch(openCardUnblock());
  };

  handleCloseUnblock = () => {
    this.props.dispatch(closeCardUnblock());
  };

  handleUnblockSubmit = (event) => {
    event.preventDefault();

    const {
      card,
      customer: { customerId, accountId } = {},
      credentials,
      dispatch,
    } = this.props;

    dispatch(setCardUnblockSubmitting(true));

    let request;

    request = Wallet.activate(
      customerId,
      accountId,
      get(card, 'id'),
      credentials,
    );

    request
      .then(() => {
        dispatch(setCardUnblockOutcome('success'));
        dispatch(
          setCard({
            ...card,
            unblockable: false,
            status_changeable: true,
            status: 'NORMAL',
            stage: 'UNBLOCKED',
          }),
        );

        window.setTimeout(() => {
          this.handleCloseUnblock();
          dispatch(showToast(this.translate('cards.unblock.success')));
        }, 1000);
      })
      .catch((error) => {
        const msg = getRequestErrorMessage(error);
        dispatch(setCardUnblockOutcome('failure'));

        window.setTimeout(() => {
          this.handleCloseUnblock();
          dispatch(
            showToast({
              message: msg || this.translate('cards.unblock.failure'),
              style: 'error',
            }),
          );
        }, 1000);
      });
  };

  render() {
    const { customer, card, match, intl, user, modal } = this.props;
    const { isHoveringCard, isSensitiveInfoShown, isRevealDataTooltipShown } =
      this.state;
    const { params } = match;
    const { customerId, accountId } = params;
    const { isCustomer, roles } = user;

    const {
      last_4_digits,
      printed_name,
      expiration_date,
      params: cardParams,
      isLoading,
      isLoadingPCI,
      status,
      card_number,
      cvv,
      type: cardType,
    } = card;

    const { isOpen } = modal;
    const linkBasePath = `/customers/${customerId}/accounts/${accountId}/profile`;
    const formattedExpirationDate =
      this.renderFormattedExpirationDate(expiration_date);
    const splitNumber = card_number ? `${card_number}`.match(/.{1,4}/g) : [];

    const paramClasses = `
      pa3 pa3dot5-ns
      f7 f6-ns pismo-darker
      bg-pismo-white
      bb b--pismo-near-white
      animate-all
    `;

    const clickableClasses = `
      ${paramClasses}
      hover-bg-pismo-dark-blue hover-white
      pointer
    `;

    const editableIndicatorClasses =
      'bb b--pismo-dark-blue b--dashed b--dotted pb1';

    const itemAnimation = {
      entering: 'o-0 mt3',
      entered: 'o-100',
      exited: 'o-0 mt3',
      exiting: 'o-100',
    };

    const vh100Safe = vh100SafeCSSClass();
    const isPlasticCard = cardType === 'PLASTIC';

    const visualCardClasses = `
      virtual-card
      relative w-90 w400-ns center br3
      pv3 ph3dot5
      bg-pismo-dark-blue pismo-light-silver
    `;

    const visualCardHoverOverlayClasses = `
      absolute w-100 h-100 top-0 left-0 br3
      bg-black ${isHoveringCard || isLoadingPCI ? 'o-70' : 'o-0'}
      ${isLoadingPCI || !isCustomer || isPlasticCard ? 'noclick' : 'pointer'}
      animate-all
    `;

    const visualCardHoverClasses = `
      absolute flex justify-around w-100 h-100 top-0 left-0
      white tc ${isHoveringCard || isLoadingPCI ? 'o-100' : 'o-0'}
      ${isLoadingPCI || !isCustomer || isPlasticCard ? 'noclick' : 'pointer'}
      animate-all
    `;

    return (
      <CustomerPageWrapper customer={customer}>
        <div className={`Cards__Card ${vh100Safe}`}>
          <div className="w-100 pv3-ns mw6dot5-ns center-ns max-h-100 overflow-y-auto">
            <div
              className={`
              ${isPlasticCard ? 'Card-plastic' : 'Card-virtual'}
              relative ph3 ph0-ns pv4 bg-pismo-lighter-gray animate-all bb b--pismo-near-white`}
            >
              <NavBar
                leftSlot={
                  <Link
                    to={`${linkBasePath}/cards`}
                    className="pismo-darker-blue no-underline"
                  >
                    <MdKeyboardBackspace />
                  </Link>
                }
                rightSlot={null}
                theme="transparent"
              />
              <div
                className={`${visualCardClasses} mt20`}
                onMouseEnter={this.handleCardMouseEnter}
                onMouseLeave={this.handleCardMouseLeave}
                onClick={this.handleCardClick}
              >
                <div className={visualCardHoverOverlayClasses} />
                <div className={visualCardHoverClasses}>
                  <div className="self-center">
                    {isLoadingPCI ? (
                      <div>
                        <Loader />
                      </div>
                    ) : (
                      <div>
                        <div className="f2 pb2">
                          {isSensitiveInfoShown ? (
                            <MdRemoveCircle />
                          ) : (
                            <MdRemoveRedEye />
                          )}
                        </div>
                        <div>
                          {isSensitiveInfoShown
                            ? 'Ocultar dados'
                            : 'Revelar dados'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-50 dib v-mid f7 f5-ns">
                  <span className="dn db-ns">
                    {cardNetworkLogos[card.network] ? (
                      <img
                        src={cardNetworkLogos[card.network]}
                        style={{ width: '36px', height: '36px' }}
                      />
                    ) : (
                      <div style={{ width: '36px', height: '36px' }} />
                    )}
                  </span>
                  <span className="db dn-ns">
                    {card.name || <FormattedMessage id="credit" />}
                  </span>
                </div>
                <div className="w-50 dib v-mid f5 f4-ns tr">
                  {isSensitiveInfoShown ? cvv || '***' : '***'}
                </div>
                <div className="pv4 pv4dot5-ns tc">
                  <h1 className="ma0 pa0 f3 f2-ns fw4 white flex justify-between">
                    <span>
                      {isSensitiveInfoShown ? splitNumber[0] || '****' : '****'}
                    </span>
                    <span>
                      {isSensitiveInfoShown ? splitNumber[1] || '****' : '****'}
                    </span>
                    <span>
                      {isSensitiveInfoShown ? splitNumber[2] || '****' : '****'}
                    </span>
                    <span>
                      {isSensitiveInfoShown
                        ? splitNumber[3] || '****'
                        : last_4_digits || '****'}
                    </span>
                  </h1>
                </div>
                <div className="w-two-thirds dib v-mid f7 f6-ns ttu">
                  {printed_name || '...'}
                </div>
                <div className="w-third dib v-mid f5 f4-ns tr">
                  {!isLoading ? formattedExpirationDate : '...'}
                </div>
              </div>
              <div
                className={`RevealDataTooltip animate-all-fast ${
                  !isRevealDataTooltipShown ? 'dn' : ''
                }`}
              >
                <div className="RevealDataBubble fw4 f6">
                  <MdRemoveRedEye />
                  &nbsp;
                  <FormattedMessage id="cards.revealData.tooltip" />
                </div>
              </div>
            </div>
            <div>
              {card.stage === 'BLOCKED' && (
                <Transition appear in timeout={200}>
                  {(state) => (
                    <ActionButton
                      onClick={this.handleActivateCard}
                      isLoading={isLoading}
                      className={`animate-all ${itemAnimation[state]}`}
                    >
                      {isLoading ? (
                        <div>...</div>
                      ) : (
                        <FormattedMessage id={'activate'} />
                      )}
                    </ActionButton>
                  )}
                </Transition>
              )}
              <ul className="list ma0 pa0">
                {cardParams.map((param, index) => (
                  <Transition appear in timeout={20 + 20 * index} key={index}>
                    {(state) => (
                      <li
                        className={`
                          ${
                            param.editable && isCustomer
                              ? clickableClasses
                              : paramClasses
                          }
                          ${itemAnimation[state]}
                        `}
                        onClick={this.getEditParamHandler(param)}
                      >
                        <div className="f7 fw4 pl0-ns pismo-light-silver">
                          <FormattedMessage id={`cards.params.${param.name}`} />
                        </div>

                        <div className="f5 mt2-ns fw4 mt1 pl0-ns pismo-darker-blue">
                          <span
                            className={
                              param.editable && isCustomer
                                ? editableIndicatorClasses
                                : ''
                            }
                          >
                            {param.type === 'date' ? (
                              <FormattedDate value={param.value} />
                            ) : param.type === 'keyword' ? (
                              intl.formatMessage({
                                id: `cards.params.${param.value}`,
                              })
                            ) : param.type === 'type' ? (
                              intl.formatMessage({
                                id: `cards.types.${param.value}`,
                              })
                            ) : param.type === 'currency' ? (
                              <FormatMoney value={param.value} showSymbol />
                            ) : param.type === 'bool' ? (
                              intl.formatMessage({
                                id: `cards.params.${param.value}`,
                              })
                            ) : param.name === 'document_number' ? (
                              formatCPFCNPJ(param.value)
                            ) : (
                              param.value
                            )}
                          </span>
                        </div>
                      </li>
                    )}
                  </Transition>
                ))}
                <Transition appear in timeout={20 + 20 * cardParams.length}>
                  {(state) => (
                    <li
                      className={`${paramClasses} pismo-pink underline ${itemAnimation[state]}`}
                    >
                      {(isCardsOnFileOperator(roles) ||
                        (isCustomer && card.type !== 'PLASTIC')) &&
                        status !== 'SUSPENDED' && (
                          // <span
                          //   className="pointer"
                          //   onClick={this.openModalToConfirmDelete}
                          // >
                          //   <FormattedMessage id="card.delete" />
                          // </span>
                          <></>
                        )}
                    </li>
                  )}
                </Transition>
              </ul>
            </div>
          </div>
        </div>
        {isOpen &&
          ((isCustomer && cardType !== 'PLASTIC') ||
            isCardsOnFileOperator(roles)) && (
            <GenericModal
              title="card.delete"
              onClose={this.handleClose}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              // onSubmit={this.deleteAccountCard}
            >
              <div className="w-80 center">
                <p className="mb3">
                  <FormattedMessage id="cards.deleteCard.confirm" />
                  <br />
                  <FormattedMessage id="areYouSure" />
                </p>

                <div className="pv3">
                  <div className="normal">
                    <FormattedMessage id="card" />{' '}
                    {card.name || <FormattedMessage id="creditcard" />} - (
                    <FormattedMessage id="card.virtual" />)
                  </div>
                  <h1 className="f3 ttu pismo-darker-blue ma0 pa0 pv2">
                    <div>{printed_name || ''}</div>
                    <div>**** **** **** {last_4_digits || '****'}</div>
                  </h1>
                </div>
              </div>
            </GenericModal>
          )}
        <EditParamModal
          onSubmit={this.handleParamSubmit}
          onClose={this.handleCloseEditParam}
        />
        <UnblockModal onSubmit={this.handleUnblockSubmit} />
      </CustomerPageWrapper>
    );
  }
}

const mapStateToProps = (
  {
    intl,
    modal,
    customer,
    call,
    card,
    credentials,
    cardStatusChange,
    cardUnblock,
    user,
    ui,
    rules,
  },
  props,
) => ({
  intl,
  customer,
  modal,
  call,
  card,
  credentials,
  cardStatusChange,
  cardUnblock,
  user,
  ui,
  rules,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(CardPage));
