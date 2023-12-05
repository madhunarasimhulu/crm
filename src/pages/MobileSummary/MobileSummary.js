import React, { Component } from 'react';
import { connect } from 'react-redux';
import isNil from 'lodash.isnil';
import { PageWrapper, MenuVertical, CustomerResume } from '../../components';

class MobileSummary extends Component {
  redirectToStatements = () => {
    const { match, history } = this.props;
    const {
      params: { customerId, accountId },
    } = match;
    const statementsPath = `/customers/${customerId}/accounts/${accountId}`;

    return history.replace(statementsPath);
  };

  componentDidUpdate(prevProps) {
    const {
      ui: { isMobile },
    } = this.props;

    if (isMobile) {
      return false;
    }

    return this.redirectToStatements();
  }

  componentDidMount() {
    const {
      ui: { isMobile },
    } = this.props;

    if (!isNil(isMobile) && !isMobile) {
      this.redirectToStatements();
    }
  }

  render() {
    const { customer } = this.props;

    return (
      <PageWrapper>
        <MenuVertical />
        <CustomerResume customer={customer} />
      </PageWrapper>
    );
  }
}

const mapStateToProps = ({ customer, call, ui }, props) => ({
  customer,
  call,
  ui,
  ...props,
});

export default connect(mapStateToProps)(MobileSummary);
