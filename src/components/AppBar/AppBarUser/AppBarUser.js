/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { MdPerson } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';
import { Customers } from '../../../clients';
import {
  setLanguage,
  closeCustomerProtocol,
  clearAttendanceNote,
  manualLogout,
} from '../../../actions';
import { logError, isDescendant } from '../../../utils';
import { CustomerAvatar } from '../..';
import BRFlag from '../../../assets/icons/BR_flag.svg';
import ESFlag from '../../../assets/icons/ES_flag.svg';
import USFlag from '../../../assets/icons/US_flag.svg';
import './AppBarUser.scss';
import pkg from '../../../../package.json';

class AppBarUser extends Component {
  state = {
    isSubMenuOpen: false,
    isLangMenuOpen: false,
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleChangeLanguage = (lang) => this.props.dispatch(setLanguage(lang));

  handleAppBarUserBlur = (event) => {
    const parent = document.getElementsByClassName('appbar-user')[0];
    const isChild = isDescendant(parent, event.target);

    if (this.state.isSubMenuOpen && !isChild) {
      this.closeSubMenu();
    }
  };

  componentDidMount() {
    window.addEventListener('click', this.handleAppBarUserBlur);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleAppBarUserBlur);
  }

  toggleSubMenu = () => {
    this.setState({
      isSubMenuOpen: !this.state.isSubMenuOpen,
    });
  };

  toogleDisplayLanguages = () => {
    this.setState({ isLangMenuOpen: !this.state.isLangMenuOpen });
  };

  closeSubMenu() {
    this.setState({
      isSubMenuOpen: false,
      isLangMenuOpen: false,
    });
  }

  closeCustomerProtocol = () => {
    const {
      credentials,
      customer: { programs },
      call: { currentProtocol },
      attendanceNotes,
      dispatch,
    } = this.props;
    const { account_id, customer_id } = programs[0];

    const notes = attendanceNotes.notes[currentProtocol];

    return Customers.closeCustomerProtocol(
      account_id,
      customer_id,
      currentProtocol,
      credentials,
      notes,
    )
      .then((data) => {
        dispatch(closeCustomerProtocol(data));
        dispatch(clearAttendanceNote({ protocol: currentProtocol }));
      })
      .catch(logError);
  };

  actualLogout = () => {
    const { pismoAuth, dispatch, history } = this.props;

    if (!pismoAuth) {
      return false;
    }

    return pismoAuth
      .logout()
      .then(() => dispatch(manualLogout()))
      .then(() => history.push('/'));
  };

  verifyPreventExit = (callback) => {
    const { call } = this.props;
    const { onCall } = call;

    this.toggleSubMenu();

    if (onCall) {
      if (window.confirm(this.translate('general.onCall.exit.confirm'))) {
        return callback();
      }
    }

    return callback();
  };

  handleProfileButtonClick = () => {
    this.verifyPreventExit(() => this.props.history.push('/profile'));
  };

  handleHelpButtonClick = () => {
    this.verifyPreventExit(() => this.props.history.push('/help'));
  };

  render() {
    const { isSubMenuOpen, isLangMenuOpen } = this.state;
    const { user, customer } = this.props; // ui
    const { isCustomer, avatar: avatarSrc } = user;
    const userEmail = user.email;
    const userName = isCustomer ? customer.entity.name : null;
    const userFakeName = userEmail ? userEmail.split('@')[0] : '';

    const commentBubbleClasses =
      'w6 w5-ns absolute top-1 right-1 lh-copy mb3 pismo-dark-blue';

    const bubbleHead = {
      width: '1em',
      height: '1em',
      background: '#eceef2',
      boxShadow: '-1px -1px 2px rgba(0, 0, 0, .2)',
      top: '0.3em',
      right: '0',
      transform: 'rotate(45deg)',
      transformOrigin: 'top right',
      position: 'absolute',
    };

    const bubbleBody = {
      top: '-1.0em',
      position: 'relative',
      background: '#eceef2',
      margin: '0',
      boxShadow: '0px 5px 8px rgba(0, 0, 0, .3)',
      borderRadius: '0.125em',
    };

    const commonItemClasses = 'bb b--white';
    const clickableItemClasses = `
      ${commonItemClasses}
      hover-pismo-lighter-gray hover-bg-pismo-dark-grayish-blue pointer
    `;
    return (
      <div className="w-100 appbar-user relative z-max AppBarUser">
        <MdPerson onClick={this.toggleSubMenu} className="user-btn" />
        <div
          className={`${commentBubbleClasses}
            ${isSubMenuOpen ? 'db' : 'dn'}`}
          style={{ top: '2em', right: '0em' }}
        >
          <div style={bubbleHead} />
          <div style={bubbleBody}>
            <div>
              <ul className="list pl0">
                <li className={commonItemClasses}>
                  <div className="w-100 ph2 ph3-ns pv3">
                    <div className="dib v-mid pl1 pv1">
                      <CustomerAvatar
                        name={userName || userFakeName}
                        src={avatarSrc}
                        size="38"
                      />
                    </div>
                    <div className="dib v-mid pl2">
                      <div className="db-ns f7 f6-ns b ttc">
                        {userName || userFakeName}
                      </div>
                      <div className="db-ns f7 fw4-ns breakword">
                        {userEmail}
                      </div>
                    </div>
                  </div>
                </li>
                <li
                  className={clickableItemClasses}
                  onClick={this.handleProfileButtonClick}
                >
                  <div className="w-100 f6 f5-ns ph3 pv3">
                    <MdPerson className="pr2 pr3-ns" />
                    <span data-testid="test-menu-profile">
                      {this.translate('userMenu.profile')}
                    </span>
                  </div>
                </li>
                {/* <li
                  data-testid="change-lang-menu"
                  className={`${clickableItemClasses}`}
                  onClick={() => this.toogleDisplayLanguages()}
                >
                  <div className="w-100 f6 f5-ns ph3 pv3">
                    <FaGlobe className="pr2 pr3-ns" />
                    <span data-testid="change-lang-menu">
                      {this.translate('userMenu.language')}
                    </span>
                  </div>
                </li>
                <li className="lang-menu-li">
                  <ul className={`list pl0 lang-menu-${isLangMenuOpen}`}>
                    <li
                      data-testid="change-lang-button-profile-pt"
                      className={clickableItemClasses}
                      onClick={() => this.handleChangeLanguage('pt')}
                    >
                      <div className="w-100 f6 f5-ns ph3 pv3 flex">
                        <img
                          src={BRFlag}
                          className="pr2 pr3-ns"
                          style={{ width: '24px', height: '24px' }}
                        />
                        <span data-testid="test-menu-language-pt">
                          {this.translate('userMenu.portuguese')}
                        </span>
                      </div>
                    </li>
                    <li
                      data-testid="change-lang-button-profile-en"
                      className={clickableItemClasses}
                      onClick={() => this.handleChangeLanguage('en')}
                    >
                      <div className="w-100 f6 f5-ns ph3 pv3 flex">
                        <img
                          src={USFlag}
                          className="pr2 pr3-ns"
                          style={{ width: '24px', height: '24px' }}
                        />
                        <span data-testid="test-menu-language-en">
                          {this.translate('userMenu.english')}
                        </span>
                      </div>
                    </li>
                    <li
                      data-testid="change-lang-button-profile-es"
                      className={clickableItemClasses}
                      onClick={() => this.handleChangeLanguage('es')}
                    >
                      <div className="w-100 f6 f5-ns ph3 pv3 flex">
                        <img
                          src={ESFlag}
                          className="pr2 pr3-ns"
                          style={{ width: '24px', height: '24px' }}
                        />
                        <span data-testid="test-menu-language-es">
                          {this.translate('userMenu.spanish')}
                        </span>
                      </div>
                    </li>
                  </ul>
                </li> */}
                <li
                  className={commonItemClasses}
                  style={{ textAlign: 'right' }}
                >
                  <div className="w-100 f7 f6-ns ph3 pv1 gray">{`Version: ${pkg.version}`}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  { user, ui, call, credentials, customer, attendanceNotes },
  props,
) => ({
  user,
  ui,
  call,
  credentials,
  customer,
  attendanceNotes,
  ...props,
});

export default connect(mapStateToProps)(withRouter(injectIntl(AppBarUser)));
