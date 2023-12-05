import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import './NewCard.scss';

import { MdKeyboardBackspace } from 'react-icons/md';
import { MdCreditCard } from 'react-icons/md';
import { MdPlace } from 'react-icons/md';
import { MdDateRange } from 'react-icons/md';
import { MdStore } from 'react-icons/md';
import { MdPhonelink } from 'react-icons/md';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {
  updateNewCardForm,
  resetNewCardForm,
  openNewCardConfirmation,
  closeNewCardConfirmation,
  setNewCardOutcome,
  setNewCardSubmitting,
  setNewCardFormValidity,
  showToast,
} from '../../actions';
import { Accounts, Wallet } from '../../clients';
import cardTypes from './types.json';
import { ConfirmationModal } from '.';
import VirtualCardForm from '../../components/forms/VirtualCardForm';
import {
  formatCPF,
  formatBirthdate,
  getRequestErrorMessage,
} from '../../utils';
import { CustomerPageWrapper } from '../../components';

/*
TEMPORARY    - "e-commerce" - "descartavel", mas pode ser reativado
CARD_ON_FILE - "recorrente" - cartao que o usuario gravaria no seu perfil em e-commerces
RECURRING    - "assinatura" - uso recorrente, assinaturas
*/

const inputClasses = `
  input-reset
  db w-100 pa2dot5
  bb bw1
  pismo-near-black bg-pismo-light-gray b--pismo-gray
  hover-bg-white hover-b--pismo-near-black
  hover-shadow-pismo-1
  animate-all
  br0
  Input
`;

const selectClasses = `
  input-reset
  db w-100 pa2dot5
  bb bw1
  pismo-near-black bg-pismo-light-gray b--pismo-gray
  hover-bg-white hover-b--pismo-near-black
  hover-shadow-pismo-1
  animate-all
  pointer
  br0
`;

class NewCardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCardType: cardTypes[0].label,
      mountedForm: null,
      virtualFormData: { data: {} },
    };
  }

  closeConfirmation = () => {
    const { virtualFormData, mountedForm } = this.state;
    const { setSubmitting } = virtualFormData;
    const { form } = mountedForm;

    setSubmitting(false);
    form && form.props.handleReset && form.props.handleReset();
    this.props.dispatch(closeNewCardConfirmation());
  };

  handleFormChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    const { dispatch } = this.props;
    let formattedValue;

    switch (name) {
      case 'document_number':
        formattedValue = formatCPF(value);
        break;
      case 'birth_date':
        formattedValue = formatBirthdate(value);
        break;
      default:
        formattedValue = value;
    }

    dispatch(
      updateNewCardForm({
        name,
        value: formattedValue,
      }),
    );

    dispatch(
      setNewCardFormValidity(
        this.formRef ? this.formRef.checkValidity() : false,
      ),
    );
  };

  handleGenderKeyDown = (event) => {
    const { keyCode } = event;
    const keyMap = {
      77: 'M',
      70: 'F',
    };

    const name = 'gender';
    const value = keyMap[keyCode];

    if (!value) {
      return false;
    }

    this.props.dispatch(
      updateNewCardForm({
        name,
        value,
      }),
    );
  };

  goToCardsPage = () => {
    const { match, history } = this.props;
    const { params } = match;
    const { customerId, accountId } = params;

    history.push(
      `/customers/${customerId}/accounts/${accountId}/profile/cards`,
    );
  };

  goToCreatedCardPage = (cardId) => {
    const { match, history } = this.props;
    const { params } = match;
    const { customerId, accountId } = params;

    history.push(
      `/customers/${customerId}/accounts/${accountId}/profile/cards`,
    );
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    const { newCard, customer, credentials, dispatch } = this.props;
    const { isValid, isConfirmationOpen } = newCard;
    const { form } = newCard;

    if (!isValid) {
      return false;
    }

    if (!isConfirmationOpen) {
      return dispatch(openNewCardConfirmation());
    }

    const { name, printed_name, birth_date, document_number, gender } = form;

    const body = {
      accountId: customer.id,
      customer: {
        name,
        printed_name: (printed_name || '').toUpperCase(),
      },
      entity: {
        name,
        birth_date,
        document_number: document_number.replace(/[^\d]+/g, ''),
        gender,
      },
    };

    dispatch(setNewCardSubmitting(true));

    Accounts.addNewCard(customer.id, body, credentials)
      .then(() => {
        dispatch(setNewCardOutcome('success'));
        window.setTimeout(() => {
          dispatch(showToast(this.translate('cards.newCard.success')));
        }, 1200);
      })
      .catch((err) => {
        const errorMsg = getRequestErrorMessage(err);
        dispatch(setNewCardOutcome('failure'));
        window.setTimeout(() => {
          dispatch(
            showToast({
              message: errorMsg || this.translate('cards.newCard.failure'),
              style: 'error',
            }),
          );
        }, 1200);
      })
      .finally(() => {
        window.setTimeout(() => {
          dispatch(closeNewCardConfirmation());
          this.goToCardsPage();
        }, 1000);
      });
  };

  getTypeIcon(type) {
    switch (type) {
      case 'physical':
        return <MdPlace />;
      case 'subscription':
        return <MdDateRange />;
      case 'recurrence':
        return <MdStore />;
      case 'ecommerce':
        return <MdPhonelink />;
      default:
        return <MdCreditCard />;
    }
  }

  handleDocumentInputRef = (element) => {
    this.documentInputRef = element;
  };

  handleBirthdateInputRef = (element) => {
    this.birthdateInputRef = element;
  };

  handleFormRef = (element) => {
    this.formRef = element;
  };

  componentWillUnmount() {
    this.props.dispatch(resetNewCardForm());
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  handleCardTypeSelected(cardTypeLabel) {
    if (!cardTypeLabel) return;

    this.setState({
      selectedCardType: cardTypeLabel,
    });
  }

  handleFormSubmitVirtual(type, data, setSubmitting) {
    const { newCard, dispatch } = this.props;
    const { isConfirmationOpen } = newCard;

    this.setState({
      virtualFormData: {
        type,
        data,
        setSubmitting,
      },
    });

    dispatch(setNewCardFormValidity(true));

    if (!isConfirmationOpen) {
      return dispatch(openNewCardConfirmation());
    }
  }

  handleFormSubmitConfirm() {
    if (this.state.virtualFormData) this.createVirtualCard();
  }

  handleFormMount(form) {
    this.setState({
      mountedForm: form,
    });
  }

  handleFormUnmount() {
    this.setState({
      mountedForm: null,
      virtualFormData: { data: {} },
    });
  }

  createVirtualCard() {
    const { customer, credentials, match, dispatch } = this.props;
    const programId = parseInt(customer.program.id, 10);
    const customerId = parseInt(match.params.customerId, 10);
    const accountId = parseInt(match.params.accountId, 10);

    const form = this.state.mountedForm;
    const { type, data, setSubmitting } = this.state.virtualFormData;
    let { card_name, transaction_limit, card_color } = data;
    transaction_limit = parseFloat(transaction_limit?.replace(/,/g, ''));

    dispatch(setNewCardSubmitting(true));

    Wallet.createCardWithLimit(
      programId,
      customerId,
      accountId,
      card_name,
      type,
      transaction_limit,
      card_color,
      credentials,
    )
      .then((data) => {
        const { id: createdCardId } = data;

        this.goToCreatedCardPage(createdCardId);

        window.setTimeout(() => {
          dispatch(
            showToast(
              this.translate('cards.newCard.cardCreatedCvvExplanation'),
            ),
          );
        }, 1000);
      })
      .catch((err) => {
        const errorMsg = getRequestErrorMessage(err);

        this.goToCardsPage();

        window.setTimeout(() => {
          dispatch(
            showToast({
              message: errorMsg || this.translate('cards.newCard.failure'),
              style: 'error',
            }),
          );
        }, 1000);
      })
      .finally(() => {
        window.setTimeout(() => {
          dispatch(closeNewCardConfirmation());

          // Clears the transient state of the form to be sent
          this.setState({
            virtualFormData: { data: {} },
          });

          // Reset the form
          setSubmitting(false);
          form && form.props.handleReset && form.props.handleReset();
        }, 1000);
      });
  }

  componentDidUpdate() {
    const { user } = this.props;
    const { customerId, isCustomer } = user;

    if (customerId && !isCustomer) {
      this.goToCardsPage();
      return window.location.reload();
    }
  }

  renderCardTypeSelector() {
    const classesCommon = 'dtc br3-ns tc pt2 pb3 collapse pointer ';
    const classesInactive = `${classesCommon}o-80 bg-pismo-lighter-gray pismo-light-silver hover-bg-pismo-dark-gray hover-pismo-lighter-gray `;
    const classesActive = `${classesCommon}bg-pismo-dark-blue white noclick `;
    const classesDisabled = `${classesCommon}o-30 pismo-light-silver noclick bg-pismo-white ba-ns b--dashed-ns `;

    const { selectedCardType } = this.state;

    return (
      <div className="pv3-ns">
        {cardTypes.map((cardType, index) => {
          const isActive = cardType.label === selectedCardType;
          let classNames = isActive ? classesActive : classesInactive;

          if (!cardType.enabled) {
            classNames = classesDisabled;
          }

          return (
            <div
              className="dit w-25 ph2-ns"
              key={index}
              onClick={this.handleCardTypeSelected.bind(
                this,
                cardType.enabled && !isActive ? cardType.label : null,
              )}
            >
              <div className={classNames} style={{ boxSizing: 'border-box' }}>
                <div className="f3 f2-ns mt1">
                  {this.getTypeIcon(cardType.label)}
                </div>
                <div className="fw4 f8-s f7-ns mt2dot5">
                  {this.translate(`cards.types.${cardType.label}`)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderFormAdditionalCard(form, isValid) {
    const genderStyle = {
      color: `#${form.gender.length > 0 ? '202832' : 'c1c7d4'}`,
    };

    const submitBtnClasses = `
      button-reset bn ph4 pv2 fw4 br1 ttu f6 ${
        isValid
          ? 'bg-pismo-orange white pointer'
          : 'bg-pismo-silver pismo-gray noclick'
      }
    `;

    return (
      <form
        name="newCardForm"
        // onSubmit={this.handleFormSubmit}
        // ref={this.handleFormRef}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        ref={this.handleFormRef}
      >
        <div className="pv2 pv3-ns">
          <input
            type="text"
            className={inputClasses}
            name="name"
            value={form.name}
            placeholder={this.translate('cards.form.holderName.placeholder')}
            onChange={this.handleFormChange}
            minLength="2"
            required
          />
        </div>

        <div className="pv2 pv3-ns">
          <input
            type="text"
            className={`${inputClasses} ${
              form.printed_name.length ? 'ttu' : ''
            }`}
            name="printed_name"
            value={form.printed_name}
            placeholder={this.translate('cards.form.printedName.placeholder')}
            onChange={this.handleFormChange}
            minLength="2"
            required
          />
        </div>

        <div className="pv2 pv3-ns">
          <input
            type="text"
            className={inputClasses}
            name="document_number"
            value={form.document_number}
            placeholder="CPF *"
            onChange={this.handleFormChange}
            ref={this.handleDocumentInputRef}
            maxLength="14"
            minLength="14"
            required
          />
        </div>

        <div className="pv3-ns">
          <div className="w-100 w-50-ns db dib-ns v-mid-ns pv2 pv0-ns pr3-ns">
            <input
              type="text"
              className={inputClasses}
              name="birth_date"
              value={form.birth_date}
              placeholder={this.translate('cards.form.birthdate.placeholder')}
              onChange={this.handleFormChange}
              ref={this.handleBirthdateInputRef}
              maxLength="10"
              minLength="10"
              required
            />
          </div>

          <div className="relative w-100 w-50-ns db dib-ns v-mid-ns pv2 pv0-ns pl3-ns">
            <select
              className={selectClasses}
              name="gender"
              value={form.gender}
              style={genderStyle}
              onChange={this.handleFormChange}
              required
            >
              <option value="" disabled>
                {this.translate('cards.form.gender.placeholder')}
              </option>
              <option value="M">{this.translate('male')}</option>
              <option value="F">{this.translate('female')}</option>
            </select>

            <div className="absolute right-0 top-0 mt3 mt2-ns mr2 f4">
              <MdKeyboardArrowDown />
            </div>
          </div>
        </div>

        <div className="tr">
          <button
            type={isValid ? 'submit' : 'button'}
            className={submitBtnClasses}
            disabled={true}
          >
            <FormattedMessage id="cards.form.submit" />
          </button>
        </div>
      </form>
    );
  }

  renderSubscriptionForm() {
    return (
      <VirtualCardForm
        data={{
          card_name: '',
          transaction_limit: 0,
          card_color: process.env.REACT_APP_CARD_BG_COLOR,
        }}
        onMount={this.handleFormMount.bind(this)}
        onUnmount={this.handleFormUnmount.bind(this)}
        onSubmit={(data, setSubmitting) =>
          this.handleFormSubmitVirtual('subscription', data, setSubmitting)
        }
        currency={this.props.org.currency}
        customerDtls={this.props.customer}
      />
    );
  }

  renderRecurrenceForm() {
    return (
      <VirtualCardForm
        data={{
          card_name: '',
          transaction_limit: 0,
          card_color: process.env.REACT_APP_CARD_BG_COLOR,
        }}
        onMount={this.handleFormMount.bind(this)}
        onUnmount={this.handleFormUnmount.bind(this)}
        onSubmit={(data, setSubmitting) =>
          this.handleFormSubmitVirtual('recurrence', data, setSubmitting)
        }
        currency={this.props.org.currency}
        customerDtls={this.props.customer}
      />
    );
  }

  renderEcommerceForm() {
    return (
      <VirtualCardForm
        data={{
          card_name: '',
          transaction_limit: 0,
          card_color: process.env.REACT_APP_CARD_BG_COLOR,
        }}
        onMount={this.handleFormMount.bind(this)}
        onUnmount={this.handleFormUnmount.bind(this)}
        onSubmit={(data, setSubmitting) =>
          this.handleFormSubmitVirtual('ecommerce', data, setSubmitting)
        }
        currency={this.props.org.currency}
        customerDtls={this.props.customer}
      />
    );
  }

  render() {
    const { customer, newCard, match, org } = this.props;
    const { form, isConfirmationOpen, isValid, isSubmitting, outcome } =
      newCard;
    const { params } = match;
    const { customerId, accountId } = params;
    const { selectedCardType, virtualFormData } = this.state;

    const linkBasePath = `/customers/${customerId}/accounts/${accountId}/profile`;

    const confirmationData = {
      ...form,
      type: virtualFormData.type,
      transaction_limit: parseFloat(
        virtualFormData?.data?.transaction_limit?.replace(/,/g, ''),
      ),
      name: virtualFormData.data.card_name,
      color: virtualFormData.data.card_color,
    };

    // const isVirtualType = selectedCardType !== 'regular'

    // return (
    //   <CustomerPageWrapper customer={customer}>
    //     <div className="w-100 mw6dot5-ns center-ns overflow-y-auto max-h-100 mt3-ns NewCard">
    //       {/* "Breadcrumb" bar */}
    //       <div className="relative dt w-100 bg-white pismo-darker-blue pv3 ph3-ns b tc">
    //         <div className="dtc v-mid">
    //           <div
    //             className="absolute f4 top-0 left-1"
    //             style={{ marginTop: '13px' }}
    //           >
    //             <Link
    //               to={`${linkBasePath}/cards`}
    //               className="pismo-darker-blue no-underline"
    //             >
    //               <MdKeyboardBackspace />
    //             </Link>
    //           </div>

    //           <FormattedMessage id="cards.form.newCard" />
    //         </div>
    //       </div>

    //       {/* Card "type" selector */}
    //       {this.renderCardTypeSelector()}

    //       {/* Form */}
    //       <div className="ph2 pv3">
    //         {selectedCardType === 'subscription' &&
    //           this.renderSubscriptionForm()}
    //         {selectedCardType === 'recurrence' && this.renderRecurrenceForm()}
    //         {selectedCardType === 'ecommerce' && this.renderEcommerceForm()}
    //         {selectedCardType === 'regular' &&
    //           this.renderFormAdditionalCard(form, isValid)}
    //         {selectedCardType === 'virtual' && this.renderSubscriptionForm()}
    //       </div>
    //     </div>

    //     <ConfirmationModal
    //       isOpen={false}
    //       isLoading={isSubmitting}
    //       outcome={outcome}
    //       data={confirmationData}
    //       // onSubmit={this.handleFormSubmit}
    //       // onClose={this.closeConfirmation}
    //       // onSubmitClickHandler={this.handleFormSubmitConfirm.bind(this)}
    //       onSubmit={() => {}}
    //       onClose={() => {}}
    //       onSubmitClickHandler={() => {}}
    //       currency={org.currency}
    //     />
    //   </CustomerPageWrapper>
    // );
    return (
      <center>
        <h1>Not Authorized</h1>
      </center>
    );
  }
}

const mapStateToProps = (
  { intl, customer, call, newCard, user, credentials, org },
  props,
) => ({
  intl,
  customer,
  call,
  newCard,
  user,
  credentials,
  org,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(NewCardPage));
