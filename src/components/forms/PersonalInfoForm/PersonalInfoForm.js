import React from 'react';
import { Prompt } from 'react-router-dom';
import getYearsOld from '../../../utils/getYearsOld';
import { TextDateInput, TextInput, Select, Button } from '../../commons';
import { isPrePaidProgramType } from '../../../utils';

export default class PersonalInfoForm extends React.Component {
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
      isSubmitting,
      setFieldValue,
      customerProgramType,
      isEditable,
      currency,
    } = this.props;

    const _fm = (id) => intl.formatMessage({ id });

    const hasValues = Object.keys(values).length > 0;
    const hasErrors = Object.keys(errors).length > 0;
    const canSubmit =
      !isSubmitting && hasValues && !hasErrors && this.isDirty() && isEditable;
    const birthDate = (values?.birth_date || '').substr(0, 10);
    const yearsOld = getYearsOld({ date: birthDate });

    return (
      <form onSubmit={handleSubmit} className="InfoForm">
        <Prompt
          when={this.isDirty()}
          message={() => _fm('general.form.dirty.confirm')}
        />
        <TextInput
          id="name"
          type="text"
          label={_fm('formLabels.name')}
          placeholder={_fm('formLabels.name')}
          error={touched.name && errors.name}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="form-name-display"
          disabled={!isEditable}
        />
        <TextInput
          id="document_number"
          type="text"
          label={_fm('formLabels.document_number')}
          placeholder={_fm('formLabels.document_number')}
          error={touched.document_number && errors.document_number}
          value={values.document_number}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="form-document-number-display"
          disabled
        />
        <TextInput
          id="email"
          type="email"
          label={_fm('formLabels.email')}
          placeholder={_fm('formLabels.email')}
          error={touched.email && errors.email}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="form-email-display"
          disabled={!isEditable}
        />
        <TextInput
          id="mothers_name"
          type="text"
          label={_fm('formLabels.mothers_name')}
          placeholder={_fm('formLabels.mothers_name')}
          error={touched.mothers_name && errors.mothers_name}
          value={values.mothers_name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!isEditable}
        />
        <div className="cf profile-group">
          <div className="fl profile-info">
            <Select
              id="marital_status"
              disabled={!isEditable}
              value={values.marital_status || undefined}
              label={_fm('formLabels.marital_status')}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="--">--</option>
              <option value="SINGLE">
                {_fm('formLabels.marital_status.single')}
              </option>
              <option value="MARRIED">
                {_fm('formLabels.marital_status.married')}
              </option>
              <option value="DIVORCED">
                {_fm('formLabels.marital_status.divorced')}
              </option>
              <option value="WIDOWER">
                {_fm('formLabels.marital_status.widower')}
              </option>
            </Select>
          </div>
          <div className="fl profile-info">
            <Select
              id="gender"
              disabled={!isEditable}
              value={values.gender || undefined}
              label={_fm('formLabels.gender')}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="--">--</option>
              <option value="M">{_fm('formLabels.gender.m')}</option>
              <option value="F">{_fm('formLabels.gender.f')}</option>
            </Select>
          </div>
          <div className="fl profile-info">
            {/* changed <TextDateInput to TextInput */}
            <TextInput
              id="birth_date"
              type="text"
              label={_fm('formLabels.birth_date')}
              placeholder={_fm('formLabels.birth_date')}
              error={touched.birth_date && errors.birth_date}
              value={new Date(birthDate).toLocaleDateString()}
              yieldBrazilianFormat={false}
              setFieldValue={setFieldValue}
              onBlur={handleBlur}
              disabled={!isEditable}
              locale={intl.locale}
            />
          </div>
        </div>

        {isPrePaidProgramType(customerProgramType) && (
          <div>
            <div className="cf profile-group">
              <div className="fl profile-info">
                <TextInput
                  id="profile_age"
                  type="text"
                  label={_fm('formLabels.profile_age')}
                  placeholder={_fm('formLabels.profile_age')}
                  error={touched.profile_age && errors.profile_age}
                  value={yearsOld}
                  disabled={!isEditable}
                />
              </div>
              <div className="fl profile-info">
                <TextInput
                  id="occupation"
                  type="text"
                  label={_fm('formLabels.occupation')}
                  placeholder={_fm('formLabels.occupation')}
                  error={touched.occupation && errors.occupation}
                  value={values.occupation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
              <div className="fl profile-info">
                <TextInput
                  id="income"
                  type="currency"
                  currency={currency || 'BRL'}
                  currencyConfig={{ locale: intl.locale }}
                  label={_fm('formLabels.income')}
                  placeholder={_fm('formLabels.income')}
                  error={touched.income && errors.income}
                  value={values.income}
                  onChange={(evt, value) => {
                    evt.target.value = value;
                    handleChange(evt);
                  }}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
              </div>
            </div>
            {/* <div className="cf">
              <div className="fl w-40 pr3">
                <TextInput
                  id="city_of_birth"
                  type="text"
                  label={_fm('formLabels.city_of_birth')}
                  placeholder={_fm('formLabels.city_of_birth')}
                  error={touched.city_of_birth && errors.city_of_birth}
                  value={values.city_of_birth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="fl w-20 pr3">
                <TextInput
                  id="state_of_birth"
                  type="text"
                  label={_fm('formLabels.state_of_birth')}
                  placeholder={_fm('formLabels.state_of_birth')}
                  error={touched.state_of_birth && errors.state_of_birth}
                  value={values.state_of_birth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="fl w-40">
                <TextInput
                  id="country_of_birth"
                  type="text"
                  label={_fm('formLabels.country_of_birth')}
                  placeholder={_fm('formLabels.country_of_birth')}
                  error={touched.country_of_birth && errors.country_of_birth}
                  value={values.country_of_birth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div> */}
            {/* <div className="cf">
              <div className="fl w-20 pr3">
                <Select
                  id="document_type"
                  value={values.document_type}
                  label={_fm('formLabels.document_type')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={'--'}>--</option>
                  <option value="RG">{_fm('formLabels.document_type.rg')}</option>
                  <option value="CNH">{_fm('formLabels.document_type.cnh')}</option>
                </Select>
              </div>
              <div className="fl w-60 pr3">
                <TextInput
                  id="other_id_number"
                  type="text"
                  label={_fm('formLabels.other_id_number')}
                  placeholder={_fm('formLabels.other_id_number')}
                  error={touched.other_id_number && errors.other_id_number}
                  value={values.other_id_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="fl w-20">
                <Select
                  id="document_issued_at"
                  value={values.document_issued_at}
                  label={_fm('formLabels.document_issued_at')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={'--'}>--</option>
                  {brazilianStates.map((state, index) => (
                    <option value={state.value} key={`state_value_${index}`}>
                      {state.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div> */}
            {/* <div className="cf">
              <div className="fl w-50 pr3">
                <TextInput
                  id="document_issued_by"
                  type="text"
                  label={_fm('formLabels.document_issued_by')}
                  placeholder={_fm('formLabels.document_issued_by')}
                  error={touched.document_issued_by && errors.document_issued_by}
                  value={values.document_issued_by}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="fl w-50">
                <TextDateInput
                  id="document_issued_date"
                  type="text"
                  label={_fm('formLabels.document_issued_date')}
                  placeholder={_fm('formLabels.document_issued_date')}
                  setFieldValue={setFieldValue}
                  yieldBrazilianFormat={true}
                  error={touched.document_issued_date && errors.document_issued_date}
                  value={values.document_issued_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div> */}
            {/* <div className="cf"> */}

            {/* <div className="fl w-50">
                <TextInput
                  id="fathers_name"
                  type="text"
                  label={_fm('formLabels.fathers_name')}
                  placeholder={_fm('formLabels.fathers_name')}
                  error={touched.fathers_name && errors.fathers_name}
                  value={values.fathers_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div> */}
            <div className="cf" />
          </div>
        )}

        {/* <div className="mt2 InfoForm__RowSubmit">
          <Button
            disabled={!canSubmit}
            text={_fm('formLabels.submit')}
            type="submit"
            className={`button button--save bg-pismo-yellow ${
              !canSubmit ? 'button--disabled' : ''
            }`}
          />
        </div> */}
      </form>
    );
  }
}
