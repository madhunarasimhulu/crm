/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { MdKeyboardBackspace } from 'react-icons/md';
import { resetCallDetails } from '../../actions';
import { CallDetailsEvents } from '.';
import { vh100SafeCSSClass } from '../../utils';

class CallDetails extends Component {
  componentWillUnmount() {
    this.resetState();
  }

  resetState = () => this.props.dispatch(resetCallDetails());

  render() {
    const {
      // has_notes,
      initial_date,
      protocol,
      // status,
      user,
      events,
      isLoadingEvents,
      isMobile,
      intl,
    } = this.props;

    const formattedInitialDate = intl.formatDate(initial_date, {
      day: isMobile ? '2-digit' : 'numeric',
      month: isMobile ? 'numeric' : 'long',
      year: isMobile ? '2-digit' : 'numeric',
    });

    const formattedInitialTime = intl.formatTime(initial_date, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const vh100Safe = vh100SafeCSSClass();

    if (!protocol) {
      return (
        <div className={`tc pa6 fw4 ${vh100Safe}`}>
          <FormattedMessage id="callDetails.empty" />
          <div className="pv5 f1">;-D</div>
        </div>
      );
    }

    return (
      <div className={`pv2 pv3-ns ph3 ph4-ns ${vh100Safe}`}>
        <div className="pb3">
          <div className="dib v-btm v-mid-ns w-50 tl">
            {isMobile && (
              <a className="pointer pr2 f4" onClick={this.resetState}>
                <MdKeyboardBackspace />
              </a>
            )}

            <span className="pismo-light-silver f7 f6-ns fw4 pl1">
              {protocol}
            </span>
          </div>

          <div className="dib v-mid w-50 pismo-light-silver f7 f6-ns fw4 tr">
            {user} - {formattedInitialDate} - {formattedInitialTime}
          </div>
        </div>

        <CallDetailsEvents events={events} isLoading={isLoadingEvents} />
      </div>
    );
  }
}

const mapStateToProps = ({ callDetails, ui, ui: { isMobile }, intl }) => ({
  ...callDetails,
  ui,
  isMobile,
  intl,
});

export default connect(mapStateToProps)(injectIntl(CallDetails));
