import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CustomerPageWrapper,
  MonthsCarousel,
  TransactionDetail,
} from '../../components';
import { resetTransaction } from '../../actions';

class TransactionPage extends Component {
  componentDidUpdate(prevProps) {
    const { call, history } = this.props;
    const { currentProtocol } = call;

    const { call: prevCall } = prevProps;

    const { currentProtocol: prevProtocol } = prevCall;

    if (prevProtocol && !currentProtocol) {
      history.push('/search');
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetTransaction());
  }

  render() {
    const { customer, statements, transaction, dispute } = this.props;
    const { months, isLoading, isScrolling, selectedMonth } = statements;

    return (
      <CustomerPageWrapper customer={customer}>
        <MonthsCarousel
          months={months}
          isScrolling={isScrolling}
          isLoading={isLoading}
          selectedMonth={selectedMonth}
        />

        <div className="mt3-ns">
          <TransactionDetail transaction={transaction} dispute={dispute} />
        </div>
      </CustomerPageWrapper>
    );
  }
}

const mapStateToProps = (
  { customer, call, statements, transaction },
  props,
) => ({
  customer,
  call,
  statements,
  transaction,
  ...props,
});

export default connect(mapStateToProps)(TransactionPage);
