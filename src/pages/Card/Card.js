import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash.get';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import { MdKeyboardBackspace } from 'react-icons/md';
import { MdRemoveRedEye } from 'react-icons/md';
import { MdRemoveCircle } from 'react-icons/md';
import { contrastColor } from 'contrast-color';
import { Wallet, PCICards, Customers } from '../../clients';
import { getRequestErrorMessage, vh100SafeCSSClass } from '../../utils';
import CardActivationModal from './CardActivation';
import {
  CustomerPageWrapper,
  FormatMoney,
  NavBar,
  NewCardModal,
} from '../../components';
import { Loader, ActionButton } from '../../components/commons';
import {
  UnblockModal,
  StatusChangeModal,
  TemporaryBlockModal,
  EditParamModal,
  PasswordChangeModal,
} from '.';
import GenericModal from '../../components/GenericModal';

import {
  openCardUnblock,
  closeCardUnblock,
  setCardUnblockSubmitting,
  setCardUnblockOutcome,
  setCard,
  openCardStatusChange,
  closeCardStatusChange,
  setCardStatusChangeSubmitting,
  setCardStatusChangeOutcome,
  showToast,
  openCardTemporaryBlock,
  closeCardTemporaryBlock,
  setCardTemporaryBlockSubmitting,
  setCardTemporaryBlockOutcome,
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
  submitNewCardReason,
  openCardPasswordChange,
  closeCardPasswordChange,
  setCardPasswordChangeSubmitting,
  showOtpCardPasswordChange,
  generateOtpCardChangePin,
  getAccountDetails,
  openAccountBlockedModal,
  getAccountStatusProfiles,
} from '../../actions';

import './Card.scss';
import FrmBlock from './Coral/FrmBlock';
import RenderIf from 'components/RenderIf';
import { modules } from 'utils/coral/Modules';

class CardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHoveringCard: false,
      isSensitiveInfoShown: false,
      isRevealDataTooltipShown: false,
      showNewCardModal: false,
      otpError: '',
      disableOtpFields: false,
      isActivationModalOpen: false,
      btnDisabled: false,
      frm_block: null,
      clientId: null,
      role: null,
      userEmail: null,
    };
  }

  handleActivationModalClose = () => {
    this.setState({
      isActivationModalOpen: false,
    });
  };

  handleActivationModalOpen = async () => {
    this.setState({
      isActivationModalOpen: true,
    });

    // const { credentials, customer, dispatch } = this.props;
    // const { userEmail } = this.state;
    // const { accountId } = customer;
    // await Customers.getAccountStatus(accountId, credentials).then((res) => {
    //   if (res?.error == true) {
    //     dispatch(
    //       showToast({
    //         message: 'Failed to fetch email details, please try again',
    //         style: 'error',
    //       }),
    //     );
    //     this.handleActivationModalClose();
    //   } else if (res?.status === 200) {
    //     this.setState({ userEmail: res?.data?.email });
    //   } else {
    //     dispatch(
    //       showToast({
    //         message: 'Something went wrong',
    //         style: 'error',
    //       }),
    //     );
    //   }
    // });
  };

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
      return;
    }

    window.setTimeout(() => {
      dispatch(showToast(this.translate(`cards.newCard.cvvExplanation`)));
    }, 1000);

    dispatch(getPCICardInfo(cardId, credentials)).then(() => {
      this.setState({
        isSensitiveInfoShown: true,
        isRevealDataTooltipShown: false,
      });

      localStorage.setItem('pismo-hide-reveal-card-tooltip', 'true');
    });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleUnblock = () => {
    this.props.dispatch(openCardUnblock());
  };

  handleCloseUnblock = () => {
    this.props.dispatch(closeCardUnblock());
  };

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

  handleUnblockSubmit = (event) => {
    event?.preventDefault();

    const {
      card,
      customer: { accountId } = {},
      credentials,
      dispatch,
    } = this.props;

    const selectedCardCustomerId = sessionStorage.getItem(
      'selectedCardCustomerId',
    );

    dispatch(setCardUnblockSubmitting(true));

    let request;

    request = Wallet.activate(
      selectedCardCustomerId,
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

  handleDefinitiveBlock = () => {
    this.props.dispatch(openCardStatusChange());
  };

  handleCloseStatusChange = () => {
    this.props.dispatch(closeCardStatusChange());
  };

  handleShowOtpField = () => {
    this.props.dispatch(showOtpCardPasswordChange());
  };

  handleTemporaryBlockSubmit = (event) => {
    event.preventDefault();

    const { card, user, credentials, dispatch } = this.props;
    const { isCustomer } = user;
    const { id: cardId, status } = card;

    if (!isCustomer) {
      return false;
    }

    dispatch(setCardTemporaryBlockSubmitting(true));

    const willBlock = status !== 'BLOCKED';
    let request;

    if (willBlock) {
      request = Wallet.temporaryBlockCard(cardId, credentials);
    } else {
      request = Wallet.temporaryUnblockCard(
        cardId,
        credentials,
        this.handleCloseTemporaryBlocking,
      );
    }

    request
      .then(() => {
        dispatch(setCardTemporaryBlockOutcome('success'));

        window.setTimeout(() => {
          dispatch(
            setCard({
              ...card,
              status: willBlock ? 'BLOCKED' : 'NORMAL',
            }),
          );

          this.handleCloseTemporaryBlocking();
          dispatch(
            showToast(
              this.translate(
                `cards.temporary${willBlock ? 'Block' : 'Unblock'}.success`,
              ),
            ),
          );
        }, 1000);
      })
      .catch((error) => {
        const msg = getRequestErrorMessage(error);
        dispatch(setCardTemporaryBlockOutcome('failure'));

        this.handleCloseTemporaryBlocking();
        dispatch(
          showToast({
            message:
              msg ||
              this.translate(
                `cards.temporary${willBlock ? 'Block' : 'Unblock'}.failure`,
              ),
            style: 'error',
          }),
        );
      });
  };

  handleTemporaryBlocking = () => {
    this.props.dispatch(openCardTemporaryBlock());
  };

  handleCloseTemporaryBlocking = () => {
    this.props.dispatch(closeCardTemporaryBlock());
  };

  handleDefinitiveBlockSubmit = (event, selectedStatus, shouldRecreate) => {
    event.preventDefault();

    const { card, credentials, dispatch } = this.props;
    const { customer, account, id } = card;

    dispatch(setCardStatusChangeSubmitting(true));

    Wallet.changeStatus(
      customer.id,
      account.id,
      id,
      selectedStatus,
      shouldRecreate,
      credentials,
    )
      .then(() => {
        dispatch(setCardStatusChangeOutcome('success'));

        window.setTimeout(() => {
          dispatch(
            setCard({
              ...card,
              status: selectedStatus,
            }),
          );

          this.handleCloseStatusChange();
          dispatch(showToast(this.translate('cards.statusChange.success')));
        }, 1000);
      })
      .catch((error) => {
        const msg = getRequestErrorMessage(error);
        dispatch(setCardStatusChangeOutcome('failure'));

        window.setTimeout(() => {
          this.handleCloseStatusChange();
          dispatch(
            showToast({
              message: msg || this.translate('cards.statusChange.failure'),
              style: 'error',
            }),
          );
        }, 1000);
      });
  };

  handleActionClick = (event) => {
    event.preventDefault();
    const {
      card: {
        unblockable = false,
        status_changeable = true,
        status,
        type,
        stage,
      },
      user: { isCustomer },
    } = this.props;

    if (type === 'PLASTIC' && status === 'CREATED') {
      return this.handleActivationModalOpen();
    } else {
      if (unblockable || stage === 'BLOCKED') {
        return this.handleUnblock();
      }
      if (status_changeable && isCustomer) {
        return this.handleTemporaryBlocking();
      }
    }
  };

  handleClose = () => {
    this.props.dispatch(closeModal());
  };

  handlePasswordChangeClick = (event) => {
    event.preventDefault();

    this.props.dispatch(openCardPasswordChange());
  };

  handlePasswordChangeClose = () => {
    this.props.dispatch(closeCardPasswordChange());
    this.setState({
      ...this.state,
      otpError: '',
      disableOtpFields: false,
    });
  };

  handlePasswordChangeSubmit = async (event, pin, otp, callback) => {
    this.setState({
      ...this.state,
      btnDisabled: true,
    });

    event.preventDefault();
    const otpValue = Object.values(otp).reduce((a, b) => a + b);
    if (otpValue?.length < 6) {
      return this.setState({
        ...this.state,
        otpError: 'Please Enter 6 Digit OTP',
      });
    }
    const { card, credentials, dispatch } = this.props;
    dispatch(setCardPasswordChangeSubmitting(true));
    const Cdata = JSON.stringify({
      client: this.state.clientId,
      otptype: 'changepin',
      otp: otpValue,
    });

    await PCICards.verifyOtpCardChangePin(Cdata)
      .then(async () => {
        await PCICards.updateCardPassword(card.id, pin, credentials)
          .then(() => {
            window.setTimeout(() => {
              dispatch(
                setCard({
                  ...card,
                  pin: pin,
                }),
              );

              this.handlePasswordChangeClose();

              dispatch(showToast(this.translate('cards.pinChange.success')));

              callback();
            }, 1000);
          })
          .catch((error) => {
            dispatch(setCardPasswordChangeSubmitting(false));

            const msg = getRequestErrorMessage(error);

            window.setTimeout(() => {
              dispatch(
                showToast({
                  message:
                    error?.response?.data?.msg ||
                    msg ||
                    this.translate('cards.pinChange.failure'),
                  style: 'error',
                }),
              );
            }, 1000);
          });
      })
      .catch((error) => {
        const OTP_MISMATCHED = 'otp mismatched';
        const MAX_LIMIT_TAKEN = 'maximum attempt taken';
        const OTP_MISMATCHED_ERROR = 'Wrong OTP Entered';
        const OTP_VERIFICATION_FAILED_ERROR = 'OTP verification failed';
        if (error?.response?.data?.msg === OTP_MISMATCHED) {
          this.setState({ ...this.state, otpError: OTP_MISMATCHED_ERROR });
          dispatch(setCardPasswordChangeSubmitting(false));
        } else if (error?.response?.data?.msg === MAX_LIMIT_TAKEN) {
          this.setState({
            ...this.state,
            otpError: MAX_LIMIT_TAKEN,
            disableOtpFields: true,
          });
          dispatch(setCardPasswordChangeSubmitting(false));
          setTimeout(async () => {
            const {
              accountId,
              account: { status_reason_id, account_status },
            } = this.props.customer;
            await dispatch(getAccountDetails(accountId));
            setTimeout(() => this.handlePasswordChangeClose(), 2000);
            if (
              account_status === 'BLOCKED' &&
              status_reason_id ===
                Number(process.env.REACT_APP_MAX_OTP_ATTEMPT_STATUS_REASON_ID)
            ) {
              await dispatch(openAccountBlockedModal());
            }
          }, 10000);
        } else {
          this.setState({
            ...this.state,
            otpError: OTP_VERIFICATION_FAILED_ERROR,
          });
          dispatch(setCardPasswordChangeSubmitting(false));
        }
      });
    this.setState({
      ...this.state,
      btnDisabled: false,
    });
  };

  handleOtpGeneration = () => {
    const { card, dispatch } = this.props;
    dispatch(setCardPasswordChangeSubmitting(true));
    const { last_4_digits } = card;
    const data = JSON.stringify({
      client: this.state.clientId,
      otptype: 'changepin',
      cclastdigit: last_4_digits,
    });
    dispatch(generateOtpCardChangePin(data))
      .then(() => {
        dispatch(setCardPasswordChangeSubmitting(false));
        dispatch(showOtpCardPasswordChange());
      })
      .catch((error) => {
        const msg = getRequestErrorMessage(error);
        window.setTimeout(() => {
          dispatch(
            showToast({
              message:
                msg ||
                'OTP generation for pin change is failed, Please try again',
              style: 'error',
            }),
          );
          this.handlePasswordChangeClose();
        }, 1000);
      });
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
    this.updateClientId();
  }

  updateClientId = () => {
    this.setState({
      clientId: sessionStorage.getItem('clientId'),
      role: sessionStorage.getItem('role'),
    });
  };

  componentWillUnmount() {
    this.props.dispatch(closeModal());
    this.props.dispatch(resetCard());
  }

  handleNewCardModal = () =>
    this.setState((state) => ({ showNewCardModal: !state.showNewCardModal }));

  handleSubmitNewCard = ({ reasonId }) => {
    const {
      dispatch,
      credentials,
      match: {
        params: { customerId, accountId, cardId },
      },
    } = this.props;
    return dispatch(
      submitNewCardReason({
        customerId,
        accountId,
        cardId,
        reasonId,
        credentials,
      }),
    );
  };

  isItNotADefinitiveStatus = (actualStatus) => {
    const nonDefinitiveStatuses = new Set([
      'created',
      'normal',
      'blocked',
      'pending',
      'warning',
      'inoperative',
    ]);
    return nonDefinitiveStatuses.has(actualStatus.toLowerCase());
  };

  updateFrmStatus = (frm_block) => {
    this.setState({ frm_block });
  };

  render() {
    const { customer, card, match, intl, user, newCard, modal } = this.props;
    const {
      isHoveringCard,
      isSensitiveInfoShown,
      isRevealDataTooltipShown,
      showNewCardModal,
      role,
      userEmail,
    } = this.state;
    const { params } = match;
    const { customerId, accountId } = params;
    const { isCustomer } = user;
    const { mailingAddress } = customer;

    const {
      last_4_digits,
      printed_name,
      expiration_date,
      params: cardParams,
      isLoading,
      isLoadingPCI,
      status,
      unblockable,
      status_changeable,
      card_number,
      cvv,
      type: cardType,
      metadata,
    } = card;
    const { reasons } = newCard;

    const { isOpen } = modal;
    const linkBasePath = `/customers/${customerId}/accounts/${accountId}/profile`;
    const formattedExpirationDate =
      this.renderFormattedExpirationDate(expiration_date);
    const splitNumber = card_number ? `${card_number}`.match(/.{1,4}/g) : [];

    const paramClasses = `
      pa3 pa3dot5-ns
      f7 f6-ns pismo-darker
      bg-pismo-lighter-gray
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

    const showCustomerActionButton =
      card.stage === 'BLOCKED' || unblockable || status_changeable;

    const vh100Safe = vh100SafeCSSClass();
    const isPlasticCard = cardType === 'PLASTIC';

    const visualCardClasses = `
      relative w-90 w400-ns center br3
      pv3 ph3dot5
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

    const cardBgColor = metadata?.color
      ? metadata?.color
      : process.env.REACT_APP_CARD_BG_COLOR;
    const cardFontColor = contrastColor({
      bgColor: cardBgColor,
      fgLightColor: process.env.REACT_APP_CARD_FONT_LIGHT_COLOR,
      fgDarkColor: process.env.REACT_APP_CARD_FONT_DARK_COLOR,
    });

    return (
      <CustomerPageWrapper customer={customer}>
        <div className={`Cards__Card ${vh100Safe}`}>
          <div className="w-100 pv3-ns mw6dot5-ns center-ns max-h-100 overflow-y-auto">
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
              theme="gray"
              title={
                cardType
                  ? intl.formatMessage({ id: `cards.types.${cardType}` })
                  : intl.formatMessage({ id: 'creditcard' })
              }
            />
            <div
              className={`
              ${
                card.type ? (isPlasticCard ? 'img-plastic' : 'img-virtual') : ''
              }
              relative ph3 ph0-ns pv4 bg-pismo-lighter-gray animate-all bb b--pismo-near-white`}
            >
              {!isLoading && !isLoadingPCI && (
                <div
                  className={visualCardClasses}
                  // onMouseEnter={this.handleCardMouseEnter}
                  // onMouseLeave={this.handleCardMouseLeave}
                  // onClick={this.handleCardClick}
                  style={{ backgroundColor: cardBgColor, color: cardFontColor }}
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
                              ? intl.formatMessage({
                                  id: 'cards.sensitiveInfo.hide',
                                })
                              : intl.formatMessage({
                                  id: 'cards.sensitiveInfo.show',
                                })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-50 dib v-mid f7 f5-ns">
                    <span className="dn db-ns">
                      {card.name || <FormattedMessage id="creditcard" />}
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
                        {isSensitiveInfoShown
                          ? splitNumber[0] || '****'
                          : '****'}
                      </span>
                      <span>
                        {isSensitiveInfoShown
                          ? splitNumber[1] || '****'
                          : '****'}
                      </span>
                      <span>
                        {isSensitiveInfoShown
                          ? splitNumber[2] || '****'
                          : '****'}
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
              )}
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
              {isLoading ? (
                <div className={paramClasses}>
                  <Loader />
                </div>
              ) : (
                <ul className="list ma0 pa0">
                  {showCustomerActionButton && (
                    <Transition appear in timeout={200}>
                      {(state) => (
                        <>
                          {this.isItNotADefinitiveStatus(status) && (
                            <div className="flex">
                              <RenderIf
                                render={modules.TEMP_CARD_BLOCK.roles.includes(
                                  role,
                                )}
                              >
                                <ActionButton
                                  onClick={(e) => {
                                    if (
                                      String(
                                        this.state.frm_block,
                                      ).toUpperCase() === 'N'
                                    )
                                      this.handleActionClick(e);
                                    else
                                      this.props.dispatch(
                                        showToast({
                                          message:
                                            'Your Card is Blocked due to Suspected Fraudulent activity, Please contact the Customer Care Center for Unblocking it',
                                          style: 'error',
                                        }),
                                      );
                                  }}
                                  isLoading={isLoading}
                                  className={`animate-all ${itemAnimation[state]}`}
                                >
                                  {isLoading ? (
                                    <div>...</div>
                                  ) : (
                                    <FormattedMessage
                                      id={
                                        unblockable || card?.stage === 'BLOCKED'
                                          ? 'activate'
                                          : status_changeable
                                          ? status === 'NORMAL'
                                            ? 'cards.temporaryBlock'
                                            : 'cards.temporaryUnblock'
                                          : '...'
                                      }
                                    />
                                  )}
                                </ActionButton>
                              </RenderIf>
                              <RenderIf
                                render={modules.DEFINITIVE_CARD_BLOCK.roles.includes(
                                  role,
                                )}
                              >
                                <ActionButton
                                  onClick={this.handleDefinitiveBlock}
                                  isLoading={isLoading}
                                  className={`animate-all ${itemAnimation[state]}`}
                                >
                                  {isLoading ? (
                                    <div>...</div>
                                  ) : (
                                    <FormattedMessage
                                      id={'cards.definitiveBlock'}
                                    />
                                  )}
                                </ActionButton>
                              </RenderIf>

                              <FrmBlock
                                card={card}
                                updateFrmStatus={this.updateFrmStatus}
                                role={role}
                              />
                            </div>
                          )}
                          {/* {status.toUpperCase() === 'NORMAL' && (
                            <div>
                              <ActionButton
                                // onClick={this.handlePasswordChangeClick}
onClick={null}
                                isLoading={isLoading}
                                className={`animate-all ${itemAnimation[state]}`}
                              >
                                {isLoading ? (
                                  <div>...</div>
                                ) : (
                                  <FormattedMessage id="cards.pinChange" />
                                )}
                              </ActionButton>
                            </div>
                          )} */}
                        </>
                      )}
                    </Transition>
                  )}
                  {cardParams
                    .filter(({ isCreditProp }) => isCreditProp)
                    .map((param, index) => (
                      <Transition
                        appear
                        in
                        timeout={20 + 20 * index}
                        key={index}
                      >
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
                            <div className="w-50 dib v-mid">
                              <FormattedMessage
                                id={`cards.params.${param.name}`}
                              />
                            </div>
                            <div className="w-50 dib v-mid tr">
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
                                ) : (
                                  param.value
                                )}
                              </span>
                            </div>
                          </li>
                        )}
                      </Transition>
                    ))}
                  {/* {isCustomer && !isPlasticCard && (
                    <Transition appear in timeout={20 + 20 * cardParams.length}>
                      {(state) => (
                        <li
                          className={`tc ${paramClasses} pismo-pink underline ${itemAnimation[state]}`}
                        >
                          <span
                            className="pointer"
                            onClick={this.openModalToConfirmDelete}
                          >
                            <FormattedMessage id="card.delete" />
                          </span>
                        </li>
                      )}
                    </Transition>
                  )} */}
                </ul>
              )}
            </div>
          </div>
        </div>
        {isOpen && isCustomer && !isPlasticCard && (
          <GenericModal
            title="card.delete"
            onClose={this.handleClose}
            // onSubmit={this.deleteAccountCard}
            onSubmit={(e) => {
              e.preventDefault();
            }}
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
        <UnblockModal onSubmit={this.handleUnblockSubmit} />

        <CardActivationModal
          handleUnblockSubmit={() => {}}
          // handleUnblockSubmit={this.handleUnblockSubmit}
          handleClose={this.handleActivationModalClose}
          open={false}
          cardId={card?.id}
          last_4_digits={last_4_digits}
          accountId={accountId}
          userDetails={user}
          userEmail={userEmail}
        />

        <StatusChangeModal onSubmit={this.handleDefinitiveBlockSubmit} />
        <TemporaryBlockModal
          onSubmit={this.handleTemporaryBlockSubmit}
          onClose={this.handleCloseTemporaryBlocking}
        />
        {/* <EditParamModal
          onSubmit={this.handleParamSubmit}
          onClose={this.handleCloseEditParam}
        /> */}
        <PasswordChangeModal
          onSubmit={this.handlePasswordChangeSubmit}
          onClose={this.handlePasswordChangeClose}
          generateOtp={this.handleOtpGeneration}
          error={this.state.otpError}
          disabled={this.state.disableOtpFields}
          btnDisabled={this.state.btnDisabled}
        />
        {showNewCardModal && (
          <NewCardModal
            address={mailingAddress}
            options={reasons}
            onSubmit={this.handleSubmitNewCard}
            onClickClose={this.handleNewCardModal}
          />
        )}
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
    newCard,
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
  newCard,
  credentials,
  cardStatusChange,
  cardUnblock,
  user,
  ui,
  rules,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(CardPage));
