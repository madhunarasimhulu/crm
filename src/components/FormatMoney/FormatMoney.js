import { Component } from 'react';
import currency from 'currency.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class FormatMoneyComponent extends Component {
  state = {
    org: this.props.org,
    precision: this.props.precision,
    showSymbol: this.props.showSymbol,
  };

  format() {
    const { value, org, precision, showSymbol } = this.props;
    return currency(value, {
      symbol: org.currencySymbol,
      decimal: org.separatorDecimals || '.',
      separator: org.separatorThousands || ',',
      precision: precision !== null && precision !== undefined ? precision : 2,
    }).format(showSymbol || false);
  }

  render() {
    return this.format();
  }
}

const mapStateToProps = ({ org }, props) => ({
  org,
  ...props,
});

FormatMoneyComponent.propTypes = {
  value: PropTypes.any.isRequired,
  showSymbol: PropTypes.bool,
  precision: PropTypes.number,
};

const FormatMoney = connect(mapStateToProps)(FormatMoneyComponent);

export { FormatMoney };
