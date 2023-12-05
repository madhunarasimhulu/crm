import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Label, InputFeedback, Input } from '..';
import './TextInput.scss';

const inputClasses = `
  input-reset
  db w-100 pa2dot5
  bb bw1
  pismo-near-black bg-pismo-light-gray b--pismo-gray
  hover-bg-white hover-b--pismo-near-black
  hover-shadow-pismo-1
  animate-all
  Input
`;

function checkNumberHasTwoDecimals(number) {
  return Number(number).toFixed(2);

  // // Convert the number to a string
  // const numberStr = number.toString();

  // // Define a regular expression to match the pattern of a number without trailing zeroes
  // const regex = /^(.*\..*[^0])0*$/;

  // // Check if the number string matches the regex
  // if (regex.test(numberStr)) {
  //   // If it matches, add '0' to the end
  //   return numberStr + '0';
  // } else {
  //   // If it doesn't match, return the original number string
  //   return numberStr;
  // }
}

function formatIndianNumber(
  convertedValue,
  withoutCommas = false,
  fromChange = false,
  fromSlider = false,
) {
  if (convertedValue === undefined) return '';
  if (String(convertedValue) === 'NaN') return '';
  if (Number(convertedValue) === 0) return '';
  if (String(convertedValue) === '0.00') return '';
  // Replacing if any alphabets came
  convertedValue = String(convertedValue).replace(/[^0-9.,]/g, '');
  // Removing first zero if any
  // convertedValue = String(convertedValue).replace(/^0/, "");
  // Replacing comma's
  convertedValue = String(convertedValue)?.replace(/[,]/g, '');
  // converting to decimals of last two
  if (convertedValue.includes('.')) {
    if (!fromChange) convertedValue = checkNumberHasTwoDecimals(convertedValue);
    convertedValue = convertedValue.replace(/[.]/g, '');
  } else {
    if (fromSlider) convertedValue = `${convertedValue}00`;
    else if (fromChange) convertedValue = `00${convertedValue}`;
    else convertedValue = `${convertedValue}00`;
  }
  convertedValue = convertedValue.replace(/^(.*)(..)$/, '$1.$2');

  if (withoutCommas === true) return convertedValue;

  let [number, decimals] = convertedValue.split('.');

  const formatter = new Intl.NumberFormat('en-IN');
  number = formatter.format(Number(number));
  convertedValue = [number, decimals].join('');
  convertedValue = convertedValue.replace(/^(.*)(..)$/, '$1.$2');
  return convertedValue;
}

function CurrencyInputWrapper(props) {
  const [value, setValue] = useState('');
  const initialRef = useRef(null);

  useEffect(() => {
    if (Boolean(initialRef.current)) return;
    if (props?.placeholder && String(props?.placeholder).length > 0) {
      initialRef.current = true;
    }
  }, [props]);

  useEffect(() => {
    if (parseFloat(props?.value) !== 0) {
      setValue(formatIndianNumber(props?.value));
      initialRef.current = props?.value;
    }
  }, [props?.value, value]);

  useEffect(() => {
    if (initialRef.current === undefined) return;
    if (
      props?.sliderValue === undefined ||
      parseFloat(props?.sliderValue) === 0
    )
      return;
    setValue(formatIndianNumber(props?.sliderValue, false, false, true));
  }, [props?.sliderValue]);

  useEffect(() => {
    return () => {
      setValue('');
      initialRef.current = undefined;
    };
  }, []);

  return (
    <input
      {...props}
      value={value}
      onChange={(event) => {
        const formattedIndianNumbWithoutCommas = formatIndianNumber(
          event.target.value,
          true,
          true,
        );
        let convertedValue = checkNumberHasTwoDecimals(
          formattedIndianNumbWithoutCommas,
        );
        let formattedIndianNumbWithCommas = formatIndianNumber(
          event.target.value,
          false,
          true,
        );
        setValue(formattedIndianNumbWithCommas);
        event.target.value = formattedIndianNumbWithCommas;
        convertedValue = parseFloat(convertedValue).toFixed(2);
        props.onChangeValue(event, convertedValue);
      }}
      type="text"
    />
  );
}

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  alignCenter,
  bigText,
  org,
  ...props
}) => {
  const classes = [
    'input-group',
    error ? 'error' : '',
    className,
    bigText ? 'f4' : '',
  ].join(' ');

  return (
    <div className={classes}>
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      {type === 'currency' ? (
        <CurrencyInputWrapper
          name={id}
          className={`${inputClasses} ${
            alignCenter ? 'tc' : ''
          } text-input currency`}
          {...props}
          onChangeValue={onChange}
          value={value}
          // value={mask(String(value), '', '.', ',', false, '', '').maskedValue}
          decimalSeparator={org.separatorDecimals || '.'}
          thousandSeparator={org.separatorThousands || ','}
        />
      ) : (
        <Input
          name={id}
          className="text-input webkit-input-fix"
          type={type}
          value={value || ''}
          onChange={onChange}
          {...props}
        />
      )}

      <InputFeedback error={error} />
    </div>
  );
};

const mapStateToProps = ({ org }, props) => ({
  org,
  ...props,
});

export default connect(mapStateToProps)(TextInput);

// Fix autofocus issues with CurrencyInput
// on iOS it will still auto focus even if autoFocus=false
// see https://github.com/jsillitoe/react-currency-input/issues/90
// let componentDidMount_super = CurrencyInput.prototype.componentDidMount;
// CurrencyInput.prototype.componentDidMount = function () {
//   if (!this.props.autoFocus) {
//     let setSelectionRange_super = this.theInput.setSelectionRange;
//     this.theInput.setSelectionRange = () => {};
//     componentDidMount_super.call(this, ...arguments);
//     this.theInput.setSelectionRange = setSelectionRange_super;
//   } else {
//     componentDidMount_super.call(this, ...arguments);
//   }
// };
// let componentDidUpdate_super = CurrencyInput.prototype.componentDidUpdate;
// CurrencyInput.prototype.componentDidUpdate = function () {
//   if (!this.props.autoFocus) {
//     let setSelectionRange_super = this.theInput.setSelectionRange;
//     this.theInput.setSelectionRange = () => {};
//     componentDidUpdate_super.call(this, ...arguments);
//     this.theInput.setSelectionRange = setSelectionRange_super;
//   } else {
//     componentDidMount_super.call(this, ...arguments);
//   }
// };
