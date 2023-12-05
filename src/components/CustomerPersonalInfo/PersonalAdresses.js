import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import PersonalInternationalAdressForm from '../forms/PersonalInternationalAdressForm';
import { customer as constants } from '../../constants';
import { getCustomerAddressesHistory } from '../../actions';

const defaultAddressTypes = ['RESIDENTIAL', 'COMMERCIAL', 'OTHER'];

class PersonalAdresses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forms: {},
      newAddressForm: null,
      lastUpdated: 0,
      isSubmitting: false,
      isDirty: false,
      isModalOpen: false,
    };
  }

  proptypes = {
    addresses: PropTypes.array,
    onAddressRemove: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitNewAddress: PropTypes.func,
    isCreditType: PropTypes.bool,
    isEditable: PropTypes.bool,
  };

  static defaultProps = {
    addresses: [],
    onAddressRemove: () => {},
    onSubmit: () => {},
    onSubmitNewAddress: () => {},
    isCreditType: false,
  };

  // Enumerates the forms that will be managed
  handleFormMount({ id, ref }) {
    this.setState({
      forms: Object.assign(this.state.forms, { [id]: ref }),
    });
  }

  // Remove the form from the refs list when dismounting
  handleFormUnmount(id) {
    const newFormState = this.state.forms;
    delete this.state.forms[id];
    this.setState({
      forms: Object.assign(newFormState),
    });
  }

  //  Assign new address form reference
  handleNewAddressFormMount({ ref }) {
    this.setState({
      newAddressForm: ref,
    });
  }

  handleMailingAddressChange(addressId) {
    // Avoid downgrading all other ids when the source id does not exist
    // Otherwise it would be possible to leave all previous addresses
    // with the flag of "mailing_address":false
    if (!addressId) return;

    // Itera pelos forms e faz o downgrade do mailingAddress dos outros enderecos
    Object.keys(this.state.forms).forEach((key) => {
      const form = this.state.forms[key];

      if (parseInt(addressId, 10) !== key) {
        if (form.downgradeMailingAddress) form.downgradeMailingAddress();
      }
    });
  }

  // Get the values ​​of the forms that can be sent
  // i.e. forms without validation errors
  handleAddressSubmit() {
    if (!this.canSubmit()) return;

    const submitableValues = [];
    Object.keys(this.state.forms).forEach((key) => {
      const form = this.state.forms[key];
      if (form.canSubmit()) submitableValues.push(form.getValues());
    });

    this.setSubmitting(true);

    this.props
      .onSubmit(submitableValues)
      .then(() => {
        this.setSubmitting(false);
      })
      .catch(() => {
        this.setSubmitting(false);
      });
  }

  // Get the values of the new address form
  handleNewAddressSubmit() {
    const form = this.state.newAddressForm;
    if (!form) return;
    if (!this.canSubmitNewAddress()) return;

    const { addresses } = this.props;
    const hasAddresses = addresses && addresses.length;
    const newAddressValues = form.getValues();

    let patchedAddresses = [];
    // Do the cast in all cases
    newAddressValues.mailing_address =
      newAddressValues.mailing_address ||
      newAddressValues.mailing_address === 'true';

    // Is setting the new address as a mailing address?
    if (hasAddresses && newAddressValues.mailing_address) {
      patchedAddresses = addresses.map((address) => {
        address.mailing_address = false;
        return address;
      });
    }

    // If don't have registered addresses, the new address must be mailing_address:true
    if (!hasAddresses) {
      newAddressValues.mailing_address = true;
    }

    const values = [newAddressValues, ...patchedAddresses];

    this.setSubmitting(true);

    this.props
      .onSubmitNewAddress(values)
      .then((done) => {
        this.setSubmitting(false);

        // Limpa os dados do form
        if (done) form.props.handleReset();
      })
      .catch(() => {
        this.setSubmitting(false);
      });
  }

  handleValuesChange() {
    // Force state/render update
    // when there is a change in a form
    // TODO: Throtling/debounce

    this.setState({
      lastUpdated: Date.now(),
      isDirty: true,
    });
  }

  handleAddressRemove(evt) {
    const { onAddressRemove } = this.props;

    onAddressRemove &&
      onAddressRemove(evt).then(() => {
        // Iterates through the forms and resets to avoid invalid values
        // i.e.: Changing to mailing address and deleting the address
        // leaves an address without mailing_addres.
        // If the address is saved, it will have the field mailing_addres:false
        Object.keys(this.state.forms).forEach((key) => {
          const form = this.state.forms[key];
          form.reset();
        });
      });
  }

  canSubmit() {
    // if at least one form can be submitted, enable submit.
    let canSubmit = false;
    Object.keys(this.state.forms).forEach((key) => {
      const form = this.state.forms[key];
      if (form.canSubmit() === true) {
        canSubmit = true;
      }
    });
    return canSubmit && !this.state.isSubmitting;
  }

  canSubmitNewAddress() {
    if (!this.state.newAddressForm) return false;
    return this.state.newAddressForm.canSubmit();
  }

  setSubmitting(_bool) {
    this.setState({
      isSubmitting: _bool,
    });
  }

  isDirty = () => {
    const { isDirty, forms } = this.state;
    let dirtyForms = 0;

    for (const key in forms) {
      const form = forms[key];

      if (!form || !form.props) {
        continue;
      }

      const { props: formProps } = form;
      const { initialValues, values } = formProps;

      if (JSON.stringify(initialValues) !== JSON.stringify(values)) {
        dirtyForms++;
      }
    }

    return dirtyForms > 0 ? isDirty : false;
  };

  getAvailableAddressesTypes() {
    const addresses = this.props.addresses || [];

    const currentAddressesTypes = addresses.map((address) => address.type);

    const availableAddressesTypes = [];

    defaultAddressTypes.forEach((type) => {
      if (currentAddressesTypes.indexOf(type) === -1) {
        availableAddressesTypes.push(type);
      }
    });

    return availableAddressesTypes;
  }

  handleClickHistoryIcons() {
    const { customer, credentials, dispatch } = this.props;
    const { customerId, accountId } = customer;

    dispatch(getCustomerAddressesHistory(customerId, accountId, credentials));

    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleCloseAddressHistoryChangesModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    const { addresses, intl, entityType, isCreditType, isEditable } =
      this.props;
    const addressesCount = (addresses && addresses.length) || 0;
    // const canAddNewAddress =
    //   entityType !== 'Company' && addressesCount < constants.maxAdresses;
    const canAddNewAddress = false;

    const _fm = (id) => intl.formatMessage({ id });

    const addressesList = isCreditType
      ? addresses
      : addresses
          .filter((address) => address.mailing_address === true)
          .slice(0, 1);

    return (
      <section className="PersonalAdresses">
        <Prompt
          when={this.isDirty()}
          message={() => _fm('general.form.dirty.confirm')}
        />
        {addresses && addresses.length > 0 && (
          <div>
            {addressesList.map((addressData, index) => (
              <React.Fragment key={addressData.id}>
                <PersonalInternationalAdressForm
                  data={addressData}
                  addressId={addressData.id}
                  isMailingAddress={addressData.mailing_address}
                  onRemove={this.handleAddressRemove.bind(this)}
                  onValuesChange={this.handleValuesChange.bind(this)}
                  onMailingAddressChange={this.handleMailingAddressChange.bind(
                    this,
                  )}
                  onMount={this.handleFormMount.bind(this)}
                  onUnmount={this.handleFormUnmount.bind(this)}
                  availableAddressesTypes={defaultAddressTypes}
                  onSubmit={this.handleAddressSubmit.bind(this)}
                  title={
                    index === 0
                      ? _fm('general.mainAddress')
                      : _fm('general.additionalAddress')
                  }
                  isCreditType={isCreditType}
                  isEditable={isEditable}
                />
              </React.Fragment>
            ))}
          </div>
        )}
        {canAddNewAddress && (
          <div className="PersonalAdressForm--newForm">
            <PersonalInternationalAdressForm
              data={{
                mailing_address: false,
                type: this.getAvailableAddressesTypes()[0],
              }}
              onValuesChange={this.handleValuesChange.bind(this)}
              onMailingAddressChange={this.handleMailingAddressChange.bind(
                this,
              )}
              onMount={this.handleNewAddressFormMount.bind(this)}
              availableAddressesTypes={this.getAvailableAddressesTypes()}
              onSubmit={this.handleNewAddressSubmit.bind(this)}
              title={_fm('general.address')}
              placeholderForm
              isCreditType={isCreditType}
              isEditable={isEditable}
            />
          </div>
        )}
      </section>
    );
  }
}
export default injectIntl(PersonalAdresses);
