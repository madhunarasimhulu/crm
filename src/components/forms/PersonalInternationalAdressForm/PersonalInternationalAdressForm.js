import React from 'react';
import { MdClose } from 'react-icons/md';
import { TextInput, Checkbox, Button, Label } from '../../commons';
import { isDefined } from '../../../utils';

export default class PersonalInternationalAdressForm extends React.Component {
  componentDidMount() {
    // Execute callback for the ancestor component to be able
    // to reference and call methods of this component
    if (this.props.onMount) {
      this.props.onMount({ id: this.props.addressId, ref: this });
    }
  }

  componentWillUnmount() {
    // Execute the callback to maintain
    // the reference of this component in the ancestor
    this.props.onUnmount && this.props.onUnmount(this.props.addressId);
  }

  canSubmit() {
    const { isSubmitting, values, errors, dirty, isEditable } = this.props;
    const hasValues = Object.keys(values).length > 2;
    const hasErrors = Object.keys(errors).length > 0;
    return !isSubmitting && hasValues && !hasErrors && dirty && isEditable;
  }

  reset() {
    this.props.handleReset();
  }

  getValues() {
    const values = {
      ...this.props.values,
    };

    if (!isDefined(values.number) || values.number === '') {
      values.number = 0;
    }

    return values;
  }

  setValues(values) {
    Object.keys(values).forEach((key) => {
      const value = values[key];
      this.props.setFieldValue(key, value);
    });
  }

  downgradeMailingAddress() {
    this.props.setFieldValue('mailing_address', false);
    this.emitOnValuesChange();
  }

  emitOnValuesChange() {
    const { onValuesChange } = this.props;
    if (onValuesChange) onValuesChange();
  }

  onSubmitHandler = (evt) => {
    evt.preventDefault();
    // Avoid forced submit on form
    if (!this.canSubmit()) return;
    const { onSubmit } = this.props;
    onSubmit && onSubmit(this.getValues());
  };

  render() {
    const {
      intl,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      onRemove,
      onMailingAddressChange,
      onZipCodeChange,
      isMailingAddress,
      isCreditType,
      isEditable,
    } = this.props;

    const _fm = (id) => intl.formatMessage({ id });

    const isNewAddress = !values?.id;

    const changeHandler = (evt) => {
      const { target } = evt;

      handleChange(evt);

      setImmediate(() => {
        this.emitOnValuesChange();

        // If it is a valid CEP change, run the respective callback
        if (target.name === 'zipcode' && !('zipcode' in this.props.errors)) {
          if (onZipCodeChange)
            onZipCodeChange({
              addressId: this.props.addressId,
              zipcode: target.value,
            });
        }
      });

      if (isNewAddress) {
        this.props.setFieldValue('mailing_address', true);
        onMailingAddressChange(-1, true);
      }
    };

    const mailingAddressChangeHandler = (evt) => {
      const { value } = evt.currentTarget;
      const { id } = values;
      const _value = value === 'true' || value === 'on';

      // Modifies the event value because formik expects
      // a boolean and the checkbox returns string
      evt.currentTarget.value = _value;

      this.props.handleBlur(evt);

      // If it already has an id, it is modifying an address that
      // already exists and can only be changed to true, never false
      if (isDefined(id)) {
        if (_value) {
          onMailingAddressChange(id, _value);
          changeHandler(evt);
          this.props.setFieldValue('mailing_address', true);
          return;
        }
      }

      changeHandler(evt);
    };

    // Can only remove an address if it is not mailing_address:true and is type credit
    // https://github.com/pismo/crm-atendimento/issues/518
    const disableAddressExclusion = isMailingAddress && isCreditType;

    return (
      <form className="PersonalAdressForm" onSubmit={this.onSubmitHandler}>
        <h3>{this.props.title}</h3>
        <div className="profile-group">
          <div className="fl profile-info1">
            <TextInput
              id="zipcode"
              type="text"
              label={_fm('formLabels.zipcode')}
              placeholder={_fm('formLabels.zipcode')}
              error={touched.zipcode && errors.zipcode}
              value={values.zipcode}
              onChange={changeHandler}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
          {isCreditType && (
            <div className="fl profile-info1 PersonalAdressForm__FieldMailing">
              <Label>{_fm('formLabels.mailingAddress')}</Label>
              <div
                className={`tw-py-4 ${!isEditable ? 'disabled-cursor' : ''}`}
              >
                <Checkbox
                  id={`mailing_address${values.id}`}
                  name="mailing_address"
                  checked={
                    !!(
                      values.mailing_address === true ||
                      values.mailing_address === 'true'
                    )
                  }
                  onChange={mailingAddressChangeHandler}
                  disabled={!isEditable}
                />
              </div>
            </div>
          )}
        </div>

        {values.address || errors.address ? (
          <div className="cf">
            <div className="cfb w-100">
              <TextInput
                id="address"
                type="text"
                label={_fm('formLabels.address')}
                placeholder={_fm('formLabels.address')}
                error={touched.address && errors.address}
                value={values.address}
                onChange={changeHandler}
                onBlur={handleBlur}
                disabled={!isEditable}
              />
            </div>
            <div className="profile-group">
              <div className="fl profile-info">
                <TextInput
                  id="number"
                  type="text"
                  label={_fm('formLabels.number')}
                  placeholder={_fm('formLabels.number')}
                  error={touched.number && errors.number}
                  value={values.number}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
              <div className="fl profile-info">
                <TextInput
                  id="complementary_address"
                  type="text"
                  label={_fm('formLabels.complementary_address')}
                  placeholder={_fm('formLabels.complementary_address')}
                  error={
                    touched.complementary_address &&
                    errors.complementary_address
                  }
                  value={values.complementary_address}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
              <div className="fl profile-info">
                <TextInput
                  id="neighborhood"
                  type="text"
                  label={_fm('formLabels.neighborhood')}
                  placeholder={_fm('formLabels.neighborhood')}
                  error={touched.neighborhood && errors.neighborhood}
                  value={values.neighborhood}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="profile-group">
              <div className="fl profile-info">
                <TextInput
                  id="city"
                  type="text"
                  label={_fm('formLabels.city')}
                  placeholder={_fm('formLabels.city')}
                  error={touched.city && errors.city}
                  value={values.city}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
              <div className="fl profile-info">
                <TextInput
                  id="state"
                  type="text"
                  label={_fm('formLabels.state')}
                  placeholder={_fm('formLabels.state')}
                  error={touched.state && errors.state}
                  value={values.state}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
              <div className="fl profile-info">
                <TextInput
                  id="country"
                  type="text"
                  label={_fm('formLabels.country')}
                  placeholder={_fm('formLabels.country')}
                  error={touched.country && errors.country}
                  value={values.country}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* <div
          className={`PersonalAdresses__RowSubmit w-100 ${
            onRemove ? 'tw-justify-between' : 'tw-justify-end'
          }`}
        >
          {onRemove && (
            <div className="button-exclude-container-form">
              <Button
                text={_fm('formLabels.remove')}
                disabled={disableAddressExclusion}
                onClick={onRemove.bind(this, values.id)}
                icon={<MdClose />}
                className="button button--exclude"
                type="button"
              />
            </div>
          )}
          <div className="w-20">
            <Button
              text={_fm('formLabels.submit')}
              type="button"
              disabled={!this.canSubmit()}
              onClick={this.onSubmitHandler}
              className={`button button--save bg-pismo-yellow ${
                !this.canSubmit() ? 'button--disabled' : ''
              }`}
            />
          </div>
        </div> */}
      </form>
    );
  }
}
