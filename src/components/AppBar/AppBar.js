import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppBarUser from './AppBarUser';
import AppBarDropdown from './AppBarDropdown/AppBarDropdown';
import AppBarProtocol from './AppBarProtocol';
import AppBarCloseProtocol from './AppBarCloseProtocol';
import AppBarTimerProtocol from './AppBarTimerProtocol';
import { Customers } from '../../clients';
import { closeCustomerProtocol, clearAttendanceNote } from '../../actions';
import { logError } from '../../utils';
// import AppBarNotification from './AppBarNotification'

import './AppBar.scss';
import { Loader } from 'components/commons';

// When entering any of these routes, the current protocol will be terminated.
const preventProtocolOnRoutes = ['search', 'notifications', 'help', 'profile'];

class AppBar extends Component {
  constructor(props) {
    super(props);
  }

  closeCurrentProtocol = () => {
    const { call, credentials, attendanceNotes, dispatch, ui } = this.props;
    const { onCall, currentProtocol, respectiveCustomer } = call;
    const { customerId, accountId } = respectiveCustomer;

    if (!onCall) {
      return false;
    }

    const notes = attendanceNotes.notes[currentProtocol];

    Customers.closeCustomerProtocol(
      accountId,
      customerId,
      currentProtocol,
      credentials,
      notes,
    ).catch(logError);
    dispatch(closeCustomerProtocol());
    dispatch(clearAttendanceNote({ protocol: currentProtocol }));
  };

  preventAbandoningProtocol = () => {
    const { ui, call } = this.props;
    const { currentRoute } = ui;
    const { onCall } = call;

    if (onCall && preventProtocolOnRoutes.includes(currentRoute)) {
      this.closeCurrentProtocol();
    }
  };

  handleUnload = () => {
    this.closeCurrentProtocol();
  };

  componentDidUpdate(prevProps) {
    const {
      ui: { currentRoute: prevRoute },
    } = prevProps;
    const {
      ui: { currentRoute },
    } = this.props;

    if (prevRoute !== currentRoute) {
      this.preventAbandoningProtocol();
    }
  }

  componentDidMount() {
    this.preventAbandoningProtocol();
    window.addEventListener('beforeunload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  render() {
    const { currentProtocol, onCall } = this.props.call;
    const { isMobile } = this.props.ui;
    const clientId = sessionStorage.getItem('clientId');

    return (
      <div className="AppBar z-max  w-100 border-box shadow-2 bg-pismo-darker-blue white relative v-mid">
        {onCall ? (
          <div className="app-menu-left dtc v-mid w-75 tl">
            <AppBarCloseProtocol />
            <AppBarTimerProtocol />
            <AppBarProtocol protocol={currentProtocol} />
          </div>
        ) : (
          <div className="app-menu-left dtc v-mid w-75 tl" />
        )}

        <div className="app-menu-right v-mid tl dropdwn-m">
          {/* <nav
            className="fr"
          > */}
          <div className="fr ph3">
            <AppBarUser />
          </div>
          <div className="fr ph1">
            <AppBarDropdown />
          </div>

          {/* <div className="fr">
              <AppBarNotification hasNotifications={true} />
            </div> */}
          {/* </nav> */}
        </div>
        {clientId === null ? (
          <Loader />
        ) : clientId === 'CL_00UTKB' ? (
          !isMobile && (
            <div className="app-menu-left dtc v-mid w-75 tl">
              <div>
                &nbsp;&nbsp;&nbsp;
                <b style={{ fontSize: '14px' }}>Customer Service: </b>
                <span style={{ fontSize: '14px', color: '#ccc' }}>
                  Toll-Free No: 18003093665 &nbsp;&nbsp;Email ID:
                  creditcards@utkarsh.bank
                </span>
              </div>
            </div>
          )
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ call, ui, credentials, attendanceNotes }) => ({
  call,
  ui,
  credentials,
  attendanceNotes,
});

export default connect(mapStateToProps)(withRouter(AppBar));
