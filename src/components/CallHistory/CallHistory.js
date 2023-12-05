import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import Observer from 'react-intersection-observer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from '../commons';
import { CallHistoryItem } from '.';
import {
  setCallDetails,
  getCallEvents,
  getCallHistory,
  resetCallHistory,
} from '../../actions';
import { vh100SafeCSSClass } from '../../utils';

class CallHistory extends Component {
  constructor(props) {
    super(props);
    this.handleObserverChangeThrottled = throttle(
      this.handleObserverChange,
      600,
    );
  }

  handleItemClick = (protocol) => {
    const { items, dispatch, credentials, user } = this.props;
    const anticipatedCallDetails = items.find(
      (call) => call.protocol === protocol,
    );
    const { customer_id, account_id } = anticipatedCallDetails;
    const { isCustomer } = user;

    dispatch(setCallDetails(anticipatedCallDetails));
    dispatch(
      getCallEvents(customer_id, account_id, protocol, credentials, isCustomer),
    );
  };

  handleHitBottom = () => {
    const {
      isLoadingMore,
      next_page,
      match,
      current_page,
      dispatch,
      credentials,
    } = this.props;
    const {
      params: { customerId, accountId },
    } = match;

    if (isLoadingMore || !next_page) {
      return false;
    }

    const pagination = {
      page: current_page + 1,
    };

    dispatch(getCallHistory(customerId, accountId, pagination, credentials));
  };

  handleObserverChange = (inView) => {
    if (!inView) {
      return false;
    }

    return this.handleHitBottom();
  };

  componentWillUnmount() {
    this.props.dispatch(resetCallHistory());
  }

  render() {
    const { items, isLoading, isLoadingMore, selectedProtocol } = this.props;

    const vh100Safe = vh100SafeCSSClass();

    if (isLoading) {
      return (
        <div className={`${vh100Safe} bg-white`}>
          <div className="max-h-100 pv5">
            <Loader size="small" />
          </div>
        </div>
      );
    }

    const listClasses = 'list ma0 pa0';

    return (
      <div className={`${vh100Safe}`}>
        <div className="max-h-100 overflow-y-auto">
          <ul className={listClasses}>
            {items.map((call) => (
              <CallHistoryItem
                {...call}
                isSelected={selectedProtocol === call.protocol}
                onClick={this.handleItemClick}
                key={call.protocol}
              />
            ))}
          </ul>

          <Observer onChange={this.handleObserverChangeThrottled}>
            <div className="bg-white pv3">
              {isLoadingMore && <Loader size="small" />}
            </div>
          </Observer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ callHistory, credentials, ui, user }, props) => ({
  ...callHistory,
  credentials,
  ui,
  user,
  ...props,
});

export default connect(mapStateToProps)(withRouter(CallHistory));
