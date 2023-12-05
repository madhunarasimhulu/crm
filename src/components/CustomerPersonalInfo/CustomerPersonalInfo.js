import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { MdHistory } from 'react-icons/md';

import PersonalInfoForm from '../forms/PersonalInfoForm';
import CompanyInfoForm from '../forms/CompanyInfoForm';
import PersonalInternationalPhoneForm from './Coral/PersonalInternationalPhoneForm';
import PersonalAdresses from './Coral/PersonalAdresses';
import { customer as constants, entityTypes } from '../../constants';

import PhoneHistoryChangesModal from '../PhoneHistoryChangesModal';

import {
  getIsAccountEnvVar,
  isCreditProgramType,
  isPrePaidProgramType,
  isDebitProgramType,
} from '../../utils';

import {
  getCustomerPhonesHistory,
  updateCustomer,
  removeCustomerPhone,
  activateCustomerPhone,
  updateCustomerAddress,
  removeCustomerAddress,
  addCustomerPhone,
  showToast,
} from '../../actions';

import './CustomerPersonalInfo.scss';

class CustomerPersonalInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isCreditType: false,
    };

    // Method binding
    const funs = ['handleSubmitPhone', 'handleUpdatePhone', 'renderPhoneRow'];
    funs.forEach((funcName) => {
      this[funcName] = this[funcName].bind(this);
    });
  }

  formatMessage(id) {
    return this.props.intl.formatMessage({ id });
  }

  handleSubmitInfo = async (payload, setSubmitting) => {
    const { dispatch, accountId, customerId, credentials } = this.props;
    const responseSubmit = {
      ...payload,
      birth_date: (payload.birth_date || '').substr(0, 10),
    };

    const payloadFormatted = Object.keys(responseSubmit).reduce(
      (acc, key) => ({
        ...acc,
        [key]: responseSubmit[key] === '--' ? null : responseSubmit[key],
      }),
      {},
    );

    let datareturn = '';
    try {
      datareturn = await dispatch(
        updateCustomer(customerId, accountId, credentials, payloadFormatted),
      );
      setSubmitting(false);
      dispatch(showToast(this.formatMessage('general.update.success')));
    } catch (err) {
      setSubmitting(false);
      dispatch(
        showToast({
          message: this.formatMessage('general.update.fail'),
          style: 'error',
        }),
      );
    }

    return datareturn;
  };

  handleSubmitPhone(payload, setSubmitting) {
    const { props } = this;
    const { dispatch } = props;
    const { accountId, customerId, credentials, customer } = props;

    const inactiveFound = customer.phones.find(
      (phone) =>
        phone.country_code === payload.country_code &&
        phone.area_code === payload.area_code &&
        phone.number === payload.number &&
        phone.type === payload.type &&
        phone.active === false,
    );

    if (!!inactiveFound) {
      return this.reactivatePhoneNumber(inactiveFound, setSubmitting);
    }

    return dispatch(
      addCustomerPhone(customerId, accountId, credentials, {
        ...payload,
        active: true,
      }),
    )
      .then((res) => {
        setSubmitting(false);
        dispatch(showToast(this.formatMessage('general.update.success')));
        return res;
      })
      .catch(() => {
        setSubmitting(false);
        dispatch(
          showToast({
            message: this.formatMessage('general.update.fail'),
            style: 'error',
          }),
        );
      });
  }

  handleUpdatePhone(phone, setSubmitting) {
    const { props } = this;
    const { dispatch } = props;
    const { accountId, customerId, credentials, customer } = props;

    const noChangesPhone = customer.phones.find(
      (_p) =>
        _p.country_code === phone.country_code &&
        _p.area_code === phone.area_code &&
        _p.number === phone.number &&
        _p.type === phone.type &&
        _p.id === phone.id,
    );

    if (noChangesPhone) {
      return;
    }

    const inactiveFound = customer.phones.find(
      (_p) =>
        _p.country_code === phone.country_code &&
        _p.area_code === phone.area_code &&
        _p.number === phone.number &&
        _p.type === phone.type &&
        _p.active === false,
    );

    if (!!inactiveFound) {
      return this.reactivatePhoneNumber(inactiveFound, setSubmitting);
    }

    return dispatch(
      addCustomerPhone(customerId, accountId, credentials, {
        ...phone,
        active: true,
      }),
    )
      .then((res) => {
        setSubmitting(false);
        dispatch(showToast(this.formatMessage('general.update.success')));
        return res;
      })
      .catch(() => {
        setSubmitting(false);
        dispatch(
          showToast({
            message: this.formatMessage('general.update.fail'),
            style: 'error',
          }),
        );
      });
  }

  handleAddressRemove(id) {
    const { props } = this;
    const { dispatch } = props;
    const { accountId, customerId, credentials } = props;

    return dispatch(
      removeCustomerAddress(customerId, accountId, credentials, id),
    )
      .then((res) => {
        dispatch(showToast(this.formatMessage('general.update.success')));
        return res;
      })
      .catch(() => {
        dispatch(
          showToast({
            message: this.formatMessage('general.update.fail'),
            style: 'error',
          }),
        );
      });
  }

  handleAddressesSubmit(payload) {
    const { props } = this;
    const { dispatch } = props;
    const { accountId, customerId, credentials } = props;

    return dispatch(
      updateCustomerAddress(customerId, accountId, credentials, payload),
    )
      .then((res) => {
        dispatch(showToast(this.formatMessage('general.update.success')));
        return res;
      })
      .catch(() => {
        dispatch(
          showToast({
            message: this.formatMessage('general.update.fail'),
            style: 'error',
          }),
        );
      });
  }

  deactivatePhoneNumber(phone) {
    const { props } = this;
    const { accountId, customerId, credentials, dispatch } = props;

    return dispatch(
      removeCustomerPhone(customerId, accountId, credentials, phone),
    )
      .then(() => {
        dispatch(showToast(this.formatMessage('general.update.success')));
      })
      .catch(() => {
        dispatch(
          showToast({
            message: this.formatMessage('general.update.fail'),
            style: 'error',
          }),
        );
      });
  }

  reactivatePhoneNumber(phone, setSubmitting) {
    const { props } = this;
    const { accountId, customerId, credentials, dispatch } = props;

    return dispatch(
      activateCustomerPhone(customerId, accountId, credentials, phone),
    )
      .then((res) => {
        setSubmitting(false);
        dispatch(showToast(this.formatMessage('general.update.success')));
        return res;
      })
      .catch(() => {
        dispatch(
          showToast({
            message: this.formatMessage('general.update.fail'),
            style: 'error',
          }),
        );
      });
  }

  renderPhoneRow(phoneData, key) {
    const {
      customer: {
        program: { type_name: customerProgramType },
      },
    } = this.props;
    const isCreditType = isCreditProgramType(customerProgramType);

    return (
      <React.Fragment key={`${key}_i_phone_form`}>
        <PersonalInternationalPhoneForm
          data={phoneData}
          isEditable={false}
          isSubmitting
          isCreditType={isCreditType}
          handleSubmit={this.handleUpdatePhone}
        />
      </React.Fragment>
    );
  }

  handleClickHistoryIcons() {
    const { customer, credentials, dispatch } = this.props;
    const { customerId, accountId } = customer;

    dispatch(getCustomerPhonesHistory(customerId, accountId, credentials));

    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleClosePhoneHistoryChangesModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    const { customer, user, credentials, dispatch, org } = this.props;
    const { entity } = customer;
    const { email, phones, addresses } = customer;
    const {
      program: { type_name: customerProgramType },
    } = customer;

    const filteredPhones = phones?.filter((phone) => phone.active) || [];

    const isCreditType =
      isCreditProgramType(customerProgramType) ||
      isDebitProgramType(customerProgramType);
    const maxPhoneNumbers = isCreditType ? constants.maxPhoneNumbers : 1;

    const phonesCount = (filteredPhones && filteredPhones.length) || 0;
    // const canAddNewPhone = phonesCount < maxPhoneNumbers;
    const canAddNewPhone = false;

    const { isCustomer } = user;
    const isAccount = getIsAccountEnvVar();
    const { isModalOpen } = this.state;
    const isEditable = false;

    const entityData = {
      ...entity,
      email,
    };

    return (
      <div className="CustomerPersonalInfo bg-pismo-near-white ph3 pv4">
        <section className="pb5">
          <h3>
            <FormattedMessage id="formLabels.personalData" />
          </h3>
          {entityData.entity_type === entityTypes.COMPANY ? (
            <CompanyInfoForm
              data={entityData}
              onSubmit={this.handleSubmitInfo}
              customerProgramType={customerProgramType}
              credentials={credentials}
              isEditable={isEditable}
              currency={org.currency}
            />
          ) : (
            <PersonalInfoForm
              data={entityData}
              onSubmit={this.handleSubmitInfo}
              customerProgramType={customerProgramType}
              isEditable={isEditable}
              data-testid="PersonalInfoForm-display"
              currency={org.currency}
            />
          )}
        </section>
        {isCreditType && (
          <section className="pb5 custPhonesSection">
            <h3>
              <FormattedMessage id="formLabels.phones" />
            </h3>
            <PersonalInternationalPhoneForm phones={phones} />
            {/* <p>
              <FormattedMessage
                id="formValidation.phoneCount"
                values={{ max: maxPhoneNumbers }}
              />
            </p> */}
            {/* {filteredPhones &&
              filteredPhones.length > 0 &&
              filteredPhones.map((phoneData, i) =>
                this.renderPhoneRow(phoneData, i),
              )}
            {canAddNewPhone && (
              <PersonalInternationalPhoneForm
                data={{
                  type: 'RESIDENTIAL',
                  country_code: '',
                  area_code: '',
                  number: '',
                  extension: '',
                }}
                handleSubmit={this.handleSubmitPhone}
                isEditable={isEditable}
              />
            )} */}
          </section>
        )}
        {/* <PersonalAdresses
          entityType={entityData.entity_type}
          user={user}
          addresses={addresses}
          onAddressRemove={this.handleAddressRemove.bind(this)}
          onSubmit={this.handleAddressesSubmit.bind(this)}
          onSubmitNewAddress={this.handleAddressesSubmit.bind(this)}
          customer={customer}
          credentials={credentials}
          dispatch={dispatch}
          isCreditType={isCreditType}
          isEditable={isEditable}
        /> */}
        <section className="pb5 custPhonesSection">
          <PersonalAdresses addresses={addresses} />
        </section>
        {isPrePaidProgramType(customerProgramType) && (
          <section className="pb5">
            <h3>
              <FormattedMessage id="formLabels.phone" />
              {
                /* exibe opção de log de alterações do telefone somente para atendente e se houver telefone cadastrado */
                !isCustomer && !isAccount && phonesCount > 0 && (
                  <MdHistory
                    className="fr pointer"
                    onClick={this.handleClickHistoryIcons.bind(this)}
                  />
                )
              }
            </h3>
            {filteredPhones &&
              filteredPhones.length > 0 &&
              filteredPhones.map((phoneData, i) =>
                this.renderPhoneRow(phoneData, i),
              )}
            {canAddNewPhone && (
              <PersonalInternationalPhoneForm
                data={{
                  type: '',
                  country_code: '',
                  area_code: '',
                  number: '',
                  extension: '',
                }}
                handleSubmit={this.handleSubmitPhone}
                isEditable={isEditable}
                isSubmitting
              />
            )}
          </section>
        )}

        {
          /* exibe o modal de log de alterações do telefone somente para atendente e se houver telefone cadastrado */
          !isCustomer && !isAccount && phonesCount > 0 && isModalOpen && (
            <PhoneHistoryChangesModal
              onClose={this.handleClosePhoneHistoryChangesModal.bind(this)}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ user, credentials, customer, org }, props) => ({
  user,
  credentials,
  customer,
  org,
  ...props,
});

export default connect(mapStateToProps)(CustomerPersonalInfo);
