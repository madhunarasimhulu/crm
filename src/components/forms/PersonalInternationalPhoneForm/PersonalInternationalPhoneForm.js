import React from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { TextInput, Select, Button } from '../../commons';

export default class PersonalInternationalPhoneForm extends React.Component {
  proptypes = {
    readOnly: PropTypes.boolean,
    onClickRemove: PropTypes.function,
  };

  static defaultProps = {
    readOnly: false,
  };

  canSubmit() {
    const { values, errors, isSubmitting, readOnly, isEditable, dirty } =
      this.props;

    const hasValues =
      values.type && values.country_code && values.area_code && values.number;
    const hasErrors = Object.keys(errors).length > 0;

    return (
      !readOnly &&
      !hasErrors &&
      !isSubmitting &&
      hasValues &&
      isEditable &&
      dirty
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
      isEditable,
    } = this.props;

    const canSubmit = this.canSubmit();
    const _fm = (id) => intl.formatMessage({ id });

    return (
      <form onSubmit={handleSubmit} className="mb4">
        <Prompt
          when={this.isDirty()}
          message={() => _fm('general.form.dirty.confirm')}
        />
        <div className="cf profile-group">
          <div className="fl profile-info2">
            <Select
              id="type"
              label={_fm('formLabels.type')}
              onChange={handleChange}
              value={values.type}
              onBlur={handleBlur}
              disabled={!isEditable}
            >
              <option value="RESIDENTIAL">
                {_fm('formLabels.phone.residential')}
              </option>
              <option value="COMMERCIAL">
                {_fm('formLabels.phone.commercial')}
              </option>
              <option value="MOBILE">{_fm('formLabels.phone.mobile')}</option>
            </Select>
          </div>
          <div className="fl profile-info">
            <TextInput
              id="country_code"
              type="tel"
              label={_fm('formLabels.countryCode')}
              error={touched.country_code && errors.country_code}
              value={values.country_code}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="cf profile-group">
          <div className="fl profile-info">
            <TextInput
              id="area_code"
              type="tel"
              label={_fm('formLabels.areaCode')}
              error={touched.area_code && errors.area_code}
              value={values.area_code}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
          <div className="fl profile-info">
            <TextInput
              id="number"
              type="tel"
              label={_fm('formLabels.phone')}
              error={touched.number && errors.number}
              value={values.number}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
          <div className="fl profile-info">
            <TextInput
              id="extension"
              type="tel"
              label={_fm('formLabels.extension')}
              error={touched.extension && errors.extension}
              value={values.extension}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
        </div>
        {/* <div className="flex justify-end">
          <div className="w-20">
            {isEditable && (
              <Button
                text={_fm('formLabels.submit')}
                disabled={!canSubmit}
                type="submit"
                className={`button button--save bg-pismo-yellow w-100 ${
                  !canSubmit ? 'button--disabled' : ''
                }`}
              />
            )}
          </div>
        </div> */}
      </form>
    );
  }
}
