import React from 'react';
import { Prompt } from 'react-router-dom';
import { TextInput, TextDateInput, Select, Button } from '../../commons';

export default class CompanyInfoForm extends React.Component {
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
      isEditable,
      currency,
    } = this.props;

    const _fm = (id) => intl.formatMessage({ id });

    const hasValues = Object.keys(values).length > 0;
    const hasErrors = Object.keys(errors).length > 0;
    const canSubmit =
      !isSubmitting && hasValues && !hasErrors && this.isDirty() && isEditable;

    return (
      <form onSubmit={handleSubmit} className="InfoForm">
        <Prompt
          when={this.isDirty()}
          message={() => _fm('general.form.dirty.confirm')}
        />
        <TextInput
          id="name"
          type="text"
          label={_fm('formLabels.social_name')}
          placeholder={_fm('formLabels.social_name')}
          error={touched.company_name && errors.company_name}
          value={values.company_name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!isEditable}
        />
        <TextInput
          id="company_document_number"
          type="text"
          label={_fm('formLabels.company_document_number')}
          placeholder={_fm('formLabels.company_document_number')}
          error={touched.document_number && errors.document_number}
          value={values.document_number}
          onChange={handleChange}
          onBlur={handleBlur}
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
          disabled={!isEditable}
        />

        <TextInput
          id="registration_number"
          type="number"
          label={_fm('formLabels.company_registration_number')}
          placeholder={_fm('formLabels.company_registration_number')}
          error={touched.registration_number && errors.registration_number}
          value={values.registration_number}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!isEditable}
        />

        <TextInput
          id="company_activity"
          type="text"
          value={values.activity}
          label={_fm('formLabels.company_activity')}
          placeholder={_fm('formLabels.company_activity')}
          error={touched.activity && errors.activity}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!isEditable}
        />

        <TextInput
          id="company_type"
          type="text"
          value={values.company_type}
          label={_fm('formLabels.company_type')}
          placeholder={_fm('formLabels.company_type')}
          error={touched.type && errors.type}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!isEditable}
        />

        <div className="cf">
          <div className="fl w-50 pr3">
            <TextInput
              id="company_format"
              type="text"
              value={values.company_format}
              label={_fm('formLabels.company_format')}
              placeholder={_fm('formLabels.company_format')}
              error={touched.type && errors.type}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
          <div className="fl w-50">
            <TextDateInput
              id="company_constitution_date"
              type="text"
              label={_fm('formLabels.company_constitution_date')}
              placeholder={_fm('formLabels.company_constitution_date')}
              error={
                touched.company_constitution_date &&
                errors.company_constitution_date
              }
              value={new Date(
                values.company_constitution_date,
              ).toLocaleDateString()}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
        </div>

        <div className="cf">
          <div className="fl w-50 pr3">
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
          <div className="fl w-50">
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

        <div className="cf">
          <div className="fl w-50 pr3">
            <TextInput
              id="net_worth"
              type="currency"
              currency={currency || 'BRL'}
              currencyConfig={{ locale: intl.locale }}
              label={_fm('formLabels.net_worth')}
              placeholder={_fm('formLabels.net_worth')}
              error={touched.net_worth && errors.net_worth}
              value={values.net_worth}
              onChange={(evt, value) => {
                evt.target.value = value;
                handleChange(evt);
              }}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
          <div className="fl w-50">
            <TextInput
              id="annual_revenues"
              type="currency"
              currency={currency || 'BRL'}
              currencyConfig={{ locale: intl.locale }}
              label={_fm('formLabels.annual_revenues')}
              placeholder={_fm('formLabels.annual_revenues')}
              error={touched.annual_revenues && errors.annual_revenues}
              value={values.annual_revenues}
              onChange={(evt, value) => {
                evt.target.value = value;
                handleChange(evt);
              }}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
        </div>

        <div className="cf">
          <div className="fl w-50 pr3">
            <Select
              id="company_pep"
              value={values.activity}
              label={_fm('formLabels.company_pep')}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            >
              <option value="--">--</option>
              <option value="true">{_fm('formLabels.yes')}</option>
              <option value="false">{_fm('formLabels.no')}</option>
            </Select>
          </div>

          <div className="fl w-50">
            <TextInput
              id="fiscal_situation"
              type="text"
              label={_fm('formLabels.fiscal_situation')}
              placeholder={_fm('formLabels.fiscal_situation')}
              error={touched.fiscal_situation && errors.fiscal_situation}
              value={values.fiscal_situation}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
            />
          </div>
        </div>

        <TextInput
          id="fiscal_situation"
          type="text"
          label={_fm('formLabels.fiscal_situation')}
          placeholder={_fm('formLabels.fiscal_situation')}
          error={touched.fiscal_situation && errors.fiscal_situation}
          value={values.fiscal_situation}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled
        />

        <div className="cf">
          <div className="fl w-50 pr3">
            <Select
              id="number_of_partners"
              value={values.activity}
              label={_fm('formLabels.number_of_partners')}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            >
              <option value="--">--</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </div>

          <div className="fl w-50">
            <TextInput
              id="perc_ownership"
              type="text"
              label={_fm('formLabels.perc_ownership')}
              placeholder={_fm('formLabels.perc_ownership')}
              error={touched.perc_ownership && errors.perc_ownership}
              value={values.perc_ownership}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditable}
            />
          </div>
        </div>

        <div className="mt4 InfoForm__RowSubmit">
          <Button
            disabled={!canSubmit}
            text={_fm('formLabels.submit')}
            type="submit"
            className={`button button--save bg-pismo-yellow ${
              !canSubmit ? 'button--disabled' : ''
            }`}
          />
        </div>
      </form>
    );
  }
}
