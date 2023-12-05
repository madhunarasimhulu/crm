/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { contrastColor } from 'contrast-color';

import { MdCreditCard } from 'react-icons/md';
import { MdLocationOn } from 'react-icons/md';
import { MdEventNote } from 'react-icons/md';
import { MdPhonelink } from 'react-icons/md';
import { MdRotateRight } from 'react-icons/md';
import { MdLock } from 'react-icons/md';
import { Loader, StickyBottomAction } from '../commons';
import { CustomerAvatar } from '..';

import { programTypes } from '../../constants';

import mastercardIcon from '../../assets/icons/mastercard.svg';
import visaIcon from '../../assets/icons/visa.svg';
import amexIcon from '../../assets/icons/amex.svg';

import './CardList.scss';
import { isCreditProgramType } from '../../utils';
import { getCards, resetCards, setCardsLoading, showToast } from 'actions';
import store from 'store';
import RenderIf from 'components/RenderIf';

const cardNetworkLogos = {
  MASTERCARD: mastercardIcon,
  VISA: visaIcon,
  AMEX: amexIcon,
};

class CardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owner_customer_id: 0,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let customersList = props?.customers?.customerList;
    if (!customersList || !Array.isArray(customersList)) return null;
    let find = customersList.find(({ customer }) => customer?.is_owner);
    if (find) {
      if (find?.customer?.id !== state.owner_customer_id) {
        //Change in props
        return {
          owner_customer_id: find?.customer?.id,
        };
      }
    }
    return null; // No change to state
  }

  renderCreditCardTypeIcon(type) {
    switch (type) {
      case 'PLASTIC':
        return <MdLocationOn />;
      case 'RECURRING':
        return <MdEventNote />;
      case 'TEMPORARY':
        return <MdPhonelink />;
      case 'CARD_ON_FILE':
        return <MdRotateRight />;
      default:
        return <MdCreditCard />;
    }
  }

  renderCardOnFileTypeIcon(type) {
    return cardNetworkLogos[type] ? (
      <img
        src={cardNetworkLogos[type]}
        style={{ width: '36px', height: '36px' }}
      />
    ) : (
      <MdCreditCard style={{ width: '36px', height: '36px' }} />
    );
  }

  componentWillUnmount() {
    this.props.dispatch(resetCards());
  }

  render() {
    const { match, cards, user, customer, customers } = this.props;
    const { isLoading, groups, cardErrorMsg, isWalletloadingCompleted } = cards;
    const { params } = match;
    const { customerId, accountId } = params;
    const { isCustomer } = user;
    const { entity } = customer;
    const clientId = sessionStorage.getItem('clientId');
    const virtualCardsLimit = clientId === 'CL_00UTKB' ? 3 : 9;

    const linkBasePath = `/customers/${customerId}/accounts/${accountId}/profile/cards`;

    const itemClasses = 'db cb w-100 pv3 bb b--pismo-lighter-gray animate-all';
    const fieldClasses = 'dib v-mid';

    const itemAnimation = {
      entering: 'o-0 mt3',
      entered: 'o-100',
      exited: 'o-0 mt3',
      exiting: 'o-100',
    };

    const isCredit =
      isCreditProgramType(customer.program.type_name) ||
      customer.program.type_name === programTypes.DEBIT;

    if (isLoading) {
      return (
        <div className="relative bg-white f6 animate-all">
          {isLoading && (
            <div className={itemClasses}>
              <Loader size="small" />
            </div>
          )}
        </div>
      );
    }

    const getCardBgColor = (cardMetadata) => {
      return cardMetadata?.color
        ? cardMetadata?.color
        : process.env.REACT_APP_CARD_BG_COLOR;
    };

    const getCardFontColor = (cardMetadata) => {
      return contrastColor({
        bgColor: getCardBgColor(cardMetadata),
        fgLightColor: process.env.REACT_APP_CARD_FONT_LIGHT_COLOR,
        fgDarkColor: process.env.REACT_APP_CARD_FONT_DARK_COLOR,
      });
    };

    groups.forEach(function (item, i) {
      if (item.customer.printedName === entity.name) {
        groups.splice(i, 1);
        groups.unshift(item);
      }
    });

    const groupHeaderClasses = `
    cb w-100 pv2dot6 ph4
    f6 fw4 pismo-dark-blue bg-pismo-gray bb b--pismo-lighter-gray
    ${
      groups?.length <= 1 && groups[0]?.customer?.id === Number(customerId)
        ? 'dn'
        : 'db'
    }
    animate-all
  `;

    let segments = window.location.href.split('/');
    let canAccessAllCards = segments.includes(
      this.state.owner_customer_id.toString(),
    );
    let urlCustomerId = segments[5];

    return (
      <div className="relative bg-white f6 animate-all">
        <ul className="list pa0 ma0">
          {isWalletloadingCompleted ? (
            <Loader />
          ) : groups?.length > 0 ? (
            groups.map((group, groupIndex) => {
              let is_owner =
                this.state.owner_customer_id === group?.customer?.id;
              return (
                <Transition
                  appear
                  in
                  timeout={50 * (groupIndex + 1)}
                  key={groupIndex}
                >
                  <li
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (
                        Number(urlCustomerId) !== Number(group?.customer?.id)
                      ) {
                        this.props.dispatch(setCardsLoading(true));
                        window.location.replace(
                          `/#/customers/${group?.customer?.id}/accounts/${accountId}/profile/cards`,
                        );
                      }
                    }}
                  >
                    <div className={groupHeaderClasses}>
                      <CustomerAvatar
                        name={group.customer.printedName || ''}
                        size="24"
                        smallLabel
                      />
                      <span className="ml2 v-mid">
                        {group.customer.printedName || ''}
                        <strong style={{ paddingLeft: 10 }}>
                          {`${is_owner ? `(Account Owner)` : ''}`}
                        </strong>
                        <isOwner />
                      </span>
                    </div>
                    <ul
                      className="list pa0 ma0"
                      data-testid="container-ul-cards"
                    >
                      <RenderIf
                        render={
                          canAccessAllCards ||
                          Number(group?.customer?.id) === Number(urlCustomerId)
                        }
                      >
                        {group.cards.map((card, index) => (
                          <Transition
                            appear
                            in
                            timeout={25 * (index + 1)}
                            key={index}
                          >
                            {(state) => (
                              <div
                                className="cursor-pointer"
                                onClick={() => {
                                  sessionStorage.setItem(
                                    'selectedCardCustomerId',
                                    group.customer.id,
                                  );
                                  this.props.history.push(
                                    linkBasePath + '/' + card.id,
                                  );
                                }}
                              >
                                <li
                                  data-testid="container-li-cards"
                                  className={`
                              pismo-dark-blue hover-bg-pismo-light-gray
                              ${
                                card.status.toUpperCase() === 'BLOCKED'
                                  ? 'o-50'
                                  : 'o-100'
                              }
                              ${itemClasses}
                              ${itemAnimation[state]}`}
                                >
                                  <div className="w-100 ph3 ph4-ns">
                                    <div
                                      className={`${fieldClasses} w-10 w-10-ns f7 f5-ns`}
                                    >
                                      <div
                                        className={`${fieldClasses} w-100 ${
                                          false
                                            ? 'pismo-blue'
                                            : 'pismo-light-silver'
                                        } ${false ? 'white-important' : ''}`}
                                      >
                                        {isCredit ? (
                                          <div
                                            className="dit pv1 ph2 ph2dot5-ns br2 f4 f3-ns"
                                            style={{
                                              backgroundColor: getCardBgColor(
                                                card.metadata,
                                              ),
                                              color: getCardFontColor(
                                                card.metadata,
                                              ),
                                            }}
                                          >
                                            <div
                                              className="dtc v-mid"
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              {this.renderCreditCardTypeIcon(
                                                card.type,
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-100">
                                            {this.renderCardOnFileTypeIcon(
                                              card.network,
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      className={`${fieldClasses} w-50 pl3 pl2-ns`}
                                    >
                                      <div className="f7 fw4 pl0-ns dn pismo-light-silver">
                                        {card.card_name || (
                                          <FormattedMessage id="creditcard" />
                                        )}
                                      </div>

                                      {isCredit && (
                                        <div className="db dn mv1 f6 f5-ns fw4 normal-ns">
                                          {card.name || (
                                            <FormattedMessage id="credit" />
                                          )}
                                        </div>
                                      )}

                                      {card.last_4_digits &&
                                        card.last_4_digits.length > 0 && (
                                          <div className="f4 mt2-ns fw4 mt1 pl0-ns pismo-darker-blue">
                                            **** {card.last_4_digits}
                                          </div>
                                        )}
                                    </div>

                                    <div
                                      className={`${fieldClasses} w-40 f7 tc tr-ns`}
                                    >
                                      <FormattedMessage id="cards.params.status" />
                                      :{' '}
                                      <span className="fcard4 pismo-darker">
                                        <FormattedMessage
                                          id={`cards.params.${card.status}`}
                                        />
                                      </span>
                                      {card.status.toUpperCase() ===
                                        'BLOCKED' && <MdLock />}
                                    </div>
                                  </div>
                                </li>
                              </div>
                            )}
                          </Transition>
                        ))}
                      </RenderIf>
                    </ul>
                  </li>
                </Transition>
              );
            })
          ) : groups?.length === 0 && cardErrorMsg != '' ? (
            <div className="bg-white pv1 f6">
              <Transition appear in timeout={100}>
                {(state) => (
                  <div
                    className={`pa4 f4-ns tc pismo-light-silver animate-all ${itemAnimation[state]}`}
                    data-testid="no-cards-info"
                  >
                    <FormattedMessage id="cards.noCards" />
                  </div>
                )}
              </Transition>
            </div>
          ) : (
            <Loader size="small" />
          )}
        </ul>

        {/* {isCustomer && (
          <Transition appear in timeout={200}>
            {(state) => (
              <StickyBottomAction
                onClick={() => {
                  const customerCardListCount = groups[0]?.cards.filter(
                    (card) =>
                      card.status === 'NORMAL' ||
                      card.status === 'BLOCKED' ||
                      card.status === 'CREATED',
                  );
                  const filteredVirtual = customerCardListCount?.filter(
                    (card) => card?.type === 'VIRTUAL',
                  ).length;
                  if (
                    customerCardListCount === undefined ||
                    filteredVirtual < virtualCardsLimit
                  ) {
                    this.props.history.push(`${linkBasePath}/new`);
                  } else {
                    window.setTimeout(() => {
                      this.props.dispatch(
                        showToast({
                          message: 'Limit exceded for maximum active cards',
                          style: 'error',
                        }),
                      );
                    }, 1200);
                  }
                }}
                className={`animate-all ${itemAnimation[state]}`}
              >
                <FormattedMessage id="cards.form.newCard" />
              </StickyBottomAction>
            )}
          </Transition>
        )} */}
      </div>
    );
  }
}

const mapStateToProps = (
  { ui, user, customer, cards, customers, credentials },
  props,
) => ({
  ui,
  user,
  customer,
  customers,
  cards,
  credentials,
  ...props,
});

export default connect(mapStateToProps)(withRouter(CardList));
