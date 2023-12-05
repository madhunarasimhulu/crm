/* eslint-disable default-case */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextInput, Button } from '../../components/commons';
import { Auth } from '../../clients';
import { showToast } from '../../actions';
import { translateMessage } from '../../utils';

import policy from './passwordPolicy';
import './UserProfile.scss';

const minLength = 8;
const maxLength = 32;
const requiredFields = [
  'currentPassword',
  'newPassword',
  'newPasswordConfirmation',
];

const initialState = {
  isSubmitting: false,
  touched: {},
  errors: {},
  values: {},
};

function getPolicyMissingRequirements(policy, value) {
  const { rules } = policy.missing(value);

  const missing = [];

  rules.forEach((rule) => {
    if (rule.verified === false) {
      if (rule.items) {
        rule.items.forEach((item) => {
          if (item.verified === false) {
            missing.push({ code: `${rule.code}-${item.code}` });
          }
        });
      } else {
        missing.push({
          code: `${rule.code}`,
          arg: rule.format && rule.format[0] ? rule.format[0] : null,
        });
      }
    }
  });

  return missing;
}

function getMissingRequirementsTranslation(intl, missingRequirements) {
  const messages = missingRequirements.map((requirement, i) => {
    const { code } = requirement;

    return (
      <FormattedMessage
        id={`formValidation.${code}`}
        values={{ arg: minLength }}
        key={i}
      />
    );
  });

  return messages;
}

export default class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }

  handleChange = (evt) => {
    const fieldName = evt.target.name;
    const value = this.formatFieldValue(fieldName, evt.target.value);

    const { values, touched } = this.state;
    const wasAlreadyTouched = !!touched[fieldName];

    this.setState({
      values: {
        ...values,
        [fieldName]: value,
      },
      touched: {
        ...touched,
        [fieldName]: true,
      },
    });

    if (wasAlreadyTouched) {
      this.validateField(fieldName, value);
    }
  };

  handleBlur = (evt) => {
    const fieldName = evt.target.name;
    const value = this.state.values[fieldName];

    this.validateField(fieldName, value);
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    this.submitNewPassword();
  };

  handleCancel = () => {
    this.redirectToHome();
  };

  formatFieldValue(fieldName, value) {
    return value.substr(0, maxLength);
  }

  validateField(fieldName, value) {
    const { values } = this.state;
    const { intl } = this.props;

    let errorMsg = [];
    let missingRequirements;

    switch (fieldName) {
      case 'currentPassword':
        if (!value || value.length < minLength) {
          errorMsg.push(
            <FormattedMessage
              id="formValidation.lengthAtLeast"
              values={{ arg: minLength }}
            />,
          );
        }
        break;
      case 'newPassword':
        if (!policy.check(value)) {
          missingRequirements = getPolicyMissingRequirements(policy, value);
          errorMsg = errorMsg.concat(
            getMissingRequirementsTranslation(intl, missingRequirements),
          );
        }
        break;
      case 'newPasswordConfirmation':
        if (!policy.check(value)) {
          missingRequirements = getPolicyMissingRequirements(policy, value);
          errorMsg = errorMsg.concat(
            getMissingRequirementsTranslation(intl, missingRequirements),
          );
        }
        if (value !== values.newPassword) {
          errorMsg.push(
            <FormattedMessage id="formValidation.password-dont-match" />,
          );
        }
        break;
    }

    const { errors } = this.state;

    this.setState({
      errors: {
        ...errors,
        [fieldName]: errorMsg,
      },
    });
  }

  resetState() {
    this.setState({ ...initialState });
  }

  redirectToHome() {
    this.props.history.push('/');
  }

  hasErrors() {
    const { errors } = this.state;

    let errorsCount = 0;

    Object.keys(errors).forEach((errorKey) => {
      if (errors[errorKey] && errors[errorKey].length > 0) errorsCount++;
    });

    return errorsCount > 0;
  }

  hasValues(fieldNames) {
    const { values } = this.state;

    let valuesCount = 0;

    Object.keys(values).forEach((valueKey) => {
      if (values[valueKey]) valuesCount++;
    });

    return valuesCount > 0;
  }

  hasRequiredValues(fieldNames) {
    const { values } = this.state;

    let valuesCount = 0;

    Object.keys(values).forEach((valueKey) => {
      if (values[valueKey]) valuesCount++;
    });

    return valuesCount === fieldNames.length;
  }

  isFormValid(fieldNames) {
    const isPristine = !this.hasValues(fieldNames);
    const hasErrors = this.hasErrors();
    const hasRequiredValues = this.hasRequiredValues(fieldNames);

    return !isPristine && !hasErrors && hasRequiredValues;
  }

  submitNewPassword() {
    const {
      credentials,
      user: { email },
      dispatch,
      intl,
    } = this.props;
    const {
      values: { currentPassword, newPassword },
    } = this.state;

    const _showToast = (message, style) => {
      dispatch(
        showToast({
          message,
          style,
        }),
      );
    };

    _showToast(translateMessage(intl, 'submitting'));
    this.setState({ isSubmitting: true });

    Auth.updatePassword(email, currentPassword, newPassword, credentials)
      .then(() => {
        _showToast(translateMessage(intl, 'general.update.success'));
        this.setState({ isSubmitting: false });
        this.resetState();
        this.redirectToHome();
      })
      .catch(() => {
        _showToast(translateMessage(intl, 'general.update.fail'), 'error');
        this.setState({ isSubmitting: false });
      });
  }

  renderErrorList(errors) {
    if (!errors || !errors.length) return null;

    return (
      <div>
        {errors.map((error, i) => (
          <div key={i}>{error}</div>
        ))}
      </div>
    );
  }

  render() {
    const { touched, errors, values, isSubmitting } = this.state;
    const { intl } = this.props;
    const _fm = (id) => intl.formatMessage({ id });

    const isFormValid = this.isFormValid(requiredFields);
    const canSubmit = !isSubmitting && isFormValid;

    return (
      <div className="UserProfile__Wrapper">
        <div className="UserProfile w-100 w-two-thirds-ns w-50-l center pa3-ns">
          <h3>
            <FormattedMessage id="profile" />
          </h3>
          <form
            onSubmit={this.handleSubmit}
            className="UserProfileForm"
            data-testid="form-test"
          >
            <div className="mb4">
              <TextInput
                id="currentPassword"
                type="password"
                label={_fm('formLabels.currentPassword')}
                placeholder={_fm('formLabels.currentPassword')}
                error={
                  touched.currentPassword &&
                  this.renderErrorList(errors.currentPassword)
                }
                value={values.currentPassword}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                data-testid="password-test"
              />
            </div>
            <div className="mb4 note">
              <FormattedMessage id="formValidation.password-requirements" />
            </div>
            <div className="mb4">
              <TextInput
                id="newPassword"
                type="password"
                label={_fm('formLabels.newPassword')}
                placeholder={_fm('formLabels.newPassword')}
                error={
                  touched.newPassword &&
                  this.renderErrorList(errors.newPassword)
                }
                value={values.newPassword}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                data-testid="password-change-test"
              />
            </div>
            <div className="mb4">
              <TextInput
                id="newPasswordConfirmation"
                type="password"
                label={_fm('formLabels.newPasswordConfirmation')}
                placeholder={_fm('formLabels.newPasswordConfirmation')}
                error={
                  touched.newPasswordConfirmation &&
                  this.renderErrorList(errors.newPasswordConfirmation)
                }
                value={values.newPasswordConfirmation}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                data-testid="password-confirm-test"
              />
            </div>
            <div className="mt4 UserProfileForm__RowSubmit cf">
              <Button
                className="button bg-pismo-near-white"
                text={_fm('cancel')}
                onClick={this.handleCancel}
              />
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
        </div>
      </div>
    );
  }
}
