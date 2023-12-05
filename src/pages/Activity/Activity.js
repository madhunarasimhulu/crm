import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomerPageWrapper } from '../../components';
import { CallsView } from '.';

class ActivityPage extends Component {
  render() {
    const { customer, match } = this.props;
    const {
      params: { view },
    } = match;

    return (
      <CustomerPageWrapper customer={customer}>
        {(!view || !view.length || view === 'calls') && <CallsView />}
      </CustomerPageWrapper>
    );
  }
}

const mapStateToProps = ({ customer }, props) => ({
  customer,
  ...props,
});

export default connect(mapStateToProps)(ActivityPage);
