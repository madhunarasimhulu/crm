import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Loader } from '../commons';
import { CallDetailsEvent } from '.';

class CallDetailsEvents extends Component {
  render() {
    const { isLoading, events } = this.props;

    if (isLoading) {
      return (
        <div className="pv4 tc">
          <Loader size="small" />
        </div>
      );
    }

    return (
      <div className="ph2 max-h-94 max-h-100-ns overflow-y-auto">
        {events.map((event, index) => (
          <CallDetailsEvent {...event} key={index} />
        ))}

        {events.length <= 0 && (
          <div className="pismo-dark-grayish-blue pv1">
            <FormattedMessage id="callDetails.events.empty" />
          </div>
        )}
      </div>
    );
  }
}

export default CallDetailsEvents;
