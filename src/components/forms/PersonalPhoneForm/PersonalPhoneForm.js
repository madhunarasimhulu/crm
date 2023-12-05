import React from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { TextInput, Select, Button } from '../../commons';
import { formatPhone } from '../../../utils';

import './PersonalPhoneForm.scss';

export default class PersonalPhoneForm extends React.Component {
  proptypes = {
    readOnly: PropTypes.boolean,
    onClickRemove: PropTypes.function,
  };

  static defaultProps = {
    readOnly: false,
  };

  handlePhoneChange(evt) {
    const _fm = (id) => this.props.intl.formatMessage({ id });
    const { value } = evt.currentTarget;
    const { length } = value;

    const { setFieldValue, setErrors, setFieldTouched } = this.props;

    // Format field data
    const formatedValue = formatPhone(value);
    setFieldValue('phone', formatedValue);
    setFieldTouched('phone', length > 0);

    // Validates the field
    let errors = {};
    if (!formatedValue) {
      errors = {
        phone: _fm('formValidation.required'),
      };
    } else if (formatedValue.length < 3 || formatedValue.length > 11) {
      errors = {
        phone: _fm('formValidation.phoneInvalid'),
      };
    }
    setErrors(errors);
  }

  canSubmit() {
    const { values, touched, errors, isSubmitting, readOnly, isEditable } =
      this.props;

    const hasValues = !!values.type && values.phone.length > 10;
    const hasErrors = Object.keys(errors).length > 0;
    return (
      !readOnly &&
      touched.phone &&
      !hasErrors &&
      !isSubmitting &&
      hasValues &&
      isEditable
    );
  }

  isDirty = () => {
    const { initialValues, values, dirty } = this.props;

    if (!initialValues || !values) {
      return dirty;
    }

    return JSON.stringify(initialValues) !== JSON.stringify(values);
  };

  render() {
    const {
      intl,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      onClickRemove,
      isEditable,
    } = this.props;

    const canSubmit = this.canSubmit();
    const isTypeCommercial = values.type === 'COMMERCIAL';
    const _fm = (id) => intl.formatMessage({ id });
    const classNames = `PersonalPhoneForm cf mb5 mb3-l PersonalPhoneForm--${
      isTypeCommercial ? 'Commercial' : 'Regular'
    }`;

    return (
      <form onSubmit={handleSubmit} className={classNames}>
        <Prompt
          when={this.isDirty()}
          message={() => _fm('general.form.dirty.confirm')}
        />
        <div className="PersonalPhoneForm__Type">
          <Select
            id="type"
            label={_fm('formLabels.type')}
            onChange={handleChange}
            value={values.type}
            onBlur={handleBlur}
            disabled={!isEditable}
          >
            <option value="">{_fm('formLabels.type')}</option>
            <option value="RESIDENTIAL">
              {_fm('formLabels.phone.residential')}
            </option>
            <option value="COMMERCIAL">
              {_fm('formLabels.phone.commercial')}
            </option>
            <option value="MOBILE">{_fm('formLabels.phone.mobile')}</option>
          </Select>
        </div>
        <div className="PersonalPhoneForm__Phone">
          <TextInput
            id="phone"
            type="tel"
            label={_fm('formLabels.phone')}
            placeholder={_fm('formLabels.phonePlaceholder')}
            error={touched.phone && errors.phone}
            value={values.phone}
            onChange={this.handlePhoneChange.bind(this)}
            onBlur={handleBlur}
            disabled={!isEditable}
          />
        </div>
        {isTypeCommercial && (
          <div className="PersonalPhoneForm__Extension">
            <TextInput
              id="extension"
              type="tel"
              label={_fm('formLabels.phone.extension')}
              placeholder={_fm('formLabels.phone.extension')}
              error={touched.extension && errors.extension}
              value={values.extension}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          {isEditable && (
            <div className="PersonalPhoneForm__Submit">
              <Button
                className="button button--exclude"
                text={_fm('formLabels.remove')}
                icon={<MdClose />}
                onClick={onClickRemove}
                disabled={!isEditable}
              />
            </div>
          )}
          {isEditable && (
            <div className="PersonalPhoneForm__Submit">
              <Button
                text={_fm('formLabels.submit')}
                disabled={!canSubmit}
                type="submit"
                className={`button button--save bg-pismo-yellow ${
                  !canSubmit ? 'button--disabled' : ''
                }`}
              />
            </div>
          )}
        </div>
      </form>
    );
  }
}
