import React from 'react';
import { getCurrencyConfig } from '../../../utils';
import { TextInput, Button, Label } from '../../commons';

export default class VirtualCardForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      limitError: '',
    };
  }
  componentDidMount() {
    // Execute callback for the ancestor component to be able
    // to reference and call methods of this component
    this.props.onMount && this.props.onMount(this);
  }

  componentWillUnmount() {
    // Execute the callback to maintain
    // the reference of this component in the ancestor
    this.props.onUnmount && this.props.onUnmount();
  }

  isDirty = () => this.props.dirty;

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
      currency,
      customerDtls,
      // handleReset,
      // setSubmitting,
      // dirty,
    } = this.props;

    const _fm = (id) => intl.formatMessage({ id });

    const hasValues =
      values &&
      Object.keys(values).length > 0 &&
      Object.keys(touched).length > 0;
    const hasErrors = Object.keys(errors).length > 0;
    const canSubmit = !isSubmitting && hasValues && !hasErrors;

    const handleCurrencyChange = (evt, value) => {
      handleChange(evt, value);
      this.setState({
        limitError:
          value > customerDtls?.limits?.max_credit_limit
            ? 'The Transaction limit entered is more than the credit limit'
            : '',
      });
    };

    return (
      <form onSubmit={handleSubmit} className="VirtualCardForm">
        <div className="cf flex-ns">
          <div className="dib w-100 w-50-ns pb3 pb1-ns ph1">
            <TextInput
              id="card_name"
              type="text"
              label={_fm('formLabels.card_name')}
              placeholder={_fm('formLabels.card_name')}
              error={touched.card_name && errors.card_name}
              value={values.card_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="webkit-input-fix"
            />
          </div>
          <div className="dib w-100 w-50-ns pb3 pb1-ns ph1">
            <TextInput
              id="transaction_limit"
              type="currency"
              label={_fm('formLabels.transaction_limit')}
              placeholder={_fm('formLabels.transaction_limit')}
              error={touched.transaction_limit && errors.transaction_limit}
              value={values.transaction_limit}
              onChange={handleCurrencyChange}
              onBlur={handleBlur}
              currency={currency || 'BRL'}
              currencyConfig={getCurrencyConfig(currency || 'BRL')}
            />
            <Label style={{ color: 'red' }}>{this.state.limitError}</Label>
          </div>
          <div className="dib w-100 w-50-ns ph1">
            <Label htmlFor="card_color">Card color</Label>
            <input
              type="color"
              id="card_color"
              name="card_color"
              value={values.card_color}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt4 tr VirtualCardForm__RowSubmit">
          <Button
            disabled={!canSubmit || this.state.limitError != ''}
            text={_fm('formLabels.submit')}
            type="submit"
            className={`button button--save bg-pismo-yellow ${
              !canSubmit || this.state.limitError != ''
                ? 'button--disabled'
                : ''
            }`}
          />
        </div>
      </form>
    );
  }
}
