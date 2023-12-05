import React from 'react';
import { connect } from 'react-redux';
import isNil from 'lodash.isnil';
import { CallHistory, CallDetails } from '../../../components';

const CallsView = ({ ui, callDetails }) => {
  const { isMobile } = ui;
  const hasCallDetails = !isNil(callDetails.protocol);

  return (
    <div className="w-100">
      <div
        className={`dib-ns v-top-ns w-100 w-third-ns z-2 ${
          isMobile && hasCallDetails ? 'dn' : 'db'
        }`}
      >
        <CallHistory />
      </div>

      <div
        className={`dib-ns v-top-ns w-two-thirds-ns ${
          isMobile && hasCallDetails
            ? 'db absolute w-100 left-0 top-0 z-999'
            : 'dn'
        }`}
      >
        <CallDetails />
      </div>
    </div>
  );
};

const mapStateToProps = ({ ui, callDetails }, props) => ({
  ui,
  callDetails,
  ...props,
});

export default connect(mapStateToProps)(CallsView);
