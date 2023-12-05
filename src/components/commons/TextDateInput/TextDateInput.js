import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';

const brFormat = /(\d{2})\/(\d{2})\/(\d{4})/;
const strippedBRFormat = /(\d{2})(\d{2})?(\d{4})?/;
const strippedISOFormat = /(\d{4})(\d{2})(\d{2})/;

const fromISOToBR = (date) =>
  date
    .replace(/[^\d]+/g, '')
    .replace(strippedISOFormat, (match, $1, $2, $3) =>
      [$3, $2, $1].filter(Boolean).join('/'),
    );
const toISOFromBR = (date) =>
  date.replace(/[^\d]+/g, '').replace(strippedBRFormat, '$3-$2-$1');
const formatBR = (date) =>
  date
    .replace(/[^\d]+/g, '')
    .replace(strippedBRFormat, (match, $1, $2, $3) =>
      [$1, $2, $3].filter(Boolean).join('/'),
    );
const formatUS = (date) =>
  date
    .replace(/[^\d]+/g, '')
    .replace(strippedISOFormat, (match, $1, $2, $3) =>
      [$1, $2, $3].filter(Boolean).join('-'),
    );

// Expect the value of YYYY/MM/DD format and show the user DD/MM/YYYY
class TextDateInput extends React.Component {
  state = {
    value: null,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.value === null && nextProps.value) {
      if (nextProps.locale === 'pt') {
        this.setState({ value: fromISOToBR(nextProps.value) });
      } else {
        this.setState({ value: nextProps.value });
      }
    }
  }

  handleChange = (event) => {
    const { yieldBrazilianFormat, setFieldValue, id, locale, onChange } =
      this.props;
    const { value } = event.target;
    const newValue = locale === 'en' ? formatUS(value) : formatBR(value);
    this.setState({ value: newValue });
    if (this.props.onChange) onChange(newValue);

    if (brFormat.test(newValue)) {
      const yieldValue = yieldBrazilianFormat
        ? newValue
        : toISOFromBR(newValue);
      setFieldValue(id, yieldValue);
    }
  };

  render() {
    const clearProps = { ...this.props };
    delete clearProps.yieldBrazilianFormat;
    delete clearProps.setFieldValue;

    return (
      <TextInput
        {...clearProps}
        id={this.props.id}
        value={(this.state.value || '').substr(0, 10)}
        onChange={this.handleChange}
        maxLength={10}
      />
    );
  }
}

TextDateInput.propTypes = {
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
  yieldBrazilianFormat: PropTypes.bool,
  locale: PropTypes.string,
  onChange: PropTypes.func,
};

TextDateInput.defaultProps = {
  value: '',
  setFieldValue: () => {},
  yieldBrazilianFormat: true,
  locale: 'pt',
  onChange: () => {},
};

export default TextDateInput;
