import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  CustomerPageWrapper,
  Statements,
  MonthsCarousel,
} from '../../components';

import './Customer.scss';

class CustomerPage extends Component {
  render() {
    const { customer, statements } = this.props;
    const { months, isLoading, isScrolling, selectedMonth } = statements;

    return (
      <CustomerPageWrapper customer={customer}>
        <MonthsCarousel
          months={months}
          isScrolling={isScrolling}
          isLoading={isLoading}
          selectedMonth={selectedMonth}
        />
        <Statements statements={statements} />
      </CustomerPageWrapper>
    );
  }
}

const mapStateToProps = ({ customer, statements, call }, props) => ({
  customer,
  statements,
  call,
  ...props,
});

export default connect(mapStateToProps)(CustomerPage);
