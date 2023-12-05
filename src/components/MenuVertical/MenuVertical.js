import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import menuOpts from './menuverticaloptions';

import { toggleAttendanceNotes } from '../../actions';
import { vh100SafeCSSClass } from '../../utils';
import { version } from '../../../package.json';

import homeIconOn from '../../assets/icons/homeOn.svg';
import homeActive from '../../assets/icons/home-active.svg';
import bars from '../../assets/icons/bars.svg';
import money from '../../assets/icons/money.svg';
import moneyActive from '../../assets/icons/money-active.svg';
import card from '../../assets/icons/card.svg';
import cardActive from '../../assets/icons/card-active.svg';
import account from '../../assets/icons/account.svg';
import accountActive from '../../assets/icons/account-active.svg';
import calendar from '../../assets/icons/calendar.svg';
import calendarActive from '../../assets/icons/calendar-active.svg';
import edit from '../../assets/icons/edit.svg';
import chevronLeft from '../../assets/icons/chevronLeft.svg';
import chevronRight from '../../assets/icons/chevronRight.svg';
import editActive from '../../assets/icons/edit-active.svg';
import rupee from '../../assets/icons/rupee.svg';
import rupeeActive from '../../assets/icons/rupee-active.svg';
import support from '../../assets/icons/support.svg';
import supportActive from '../../assets/icons/supportActive.svg';
import serviceRequest from '../../assets/icons/serviceRequest.svg';
import serviceRequestActive from '../../assets/icons/serviceRequestActive.svg';
import timeline from '../../assets/icons/timeline.svg';
import ListAltIcon from '@material-ui/icons/ListAlt';
import './MenuVertical.scss';
import Notes from 'components/coral/Notes';

class MenuVertical extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enableMotion: !!sessionStorage.getItem('enableMotion'),
      clientId: sessionStorage.getItem('clientId'),
    };

    this.listIcon = {
      mobileSummary: {
        on: this.getIcon(homeIconOn, 'mobileSummary'),
        active: this.getIcon(homeActive, 'mobileSummary'),
      },
      statements: {
        on: this.getIcon(rupee, 'statements'),
        active: this.getIcon(rupeeActive, 'statements'),
      },
      timeline: {
        on: this.getIcon(timeline, 'Timeline'),
        active: this.getIcon(timeline, 'Timeline'),
      },
      debit: {
        on: this.getIcon(rupee, 'statements'),
        active: this.getIcon(rupeeActive, 'statements'),
      },
      prepaid: {
        on: this.getIcon(rupee, 'statements'),
        active: this.getIcon(rupeeActive, 'statements'),
      },
      profileParams: {
        on: this.getIcon(account, 'profile'),
        active: this.getIcon(accountActive, 'profile'),
      },
      cards: {
        on: this.getIcon(card, 'cards'),
        active: this.getIcon(cardActive, 'cards'),
      },
      activity: {
        on: this.getIcon(calendar, 'activity'),
        active: this.getIcon(calendarActive, 'activity'),
      },
      notes: {
        on: this.getIcon(edit, 'notes'),
        active: this.getIcon(editActive, 'notes'),
      },
      pid: {
        on: this.getIcon(calendar, 'activity'),
        active: this.getIcon(calendarActive, 'activity'),
      },

      support: {
        on: this.getIcon(support, 'customer service'),
        active: this.getIcon(supportActive, 'customer service'),
      },

      serviceRequests: {
        on: this.getIcon(serviceRequest, 'service Requests'),
        active: this.getIcon(serviceRequestActive, 'service Requests'),
      },
    };
  }

  toggleAttendanceNotes() {
    this.props.dispatch(toggleAttendanceNotes());
  }

  closeAttendanceNotesIfNeeded = () => {
    const { attendanceNotes, ui } = this.props;
    const { isVisible } = attendanceNotes;
    const { isMobile } = ui;

    if (isVisible && isMobile) {
      return this.toggleAttendanceNotes();
    }
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  getIcon = (icon, alt, otherProps = {}) => (
    <img
      src={icon}
      style={{ width: '22px', height: '22px' }}
      alt={this.translate(alt)}
      {...otherProps}
    />
  );

  renderMenuLink(item, classes, currentRoute, isMobile) {
    let hideLabel = !this.state.enableMotion;
    return (
      <Link
        className={classes}
        to={item.to}
        onClick={this.closeAttendanceNotesIfNeeded}
      >
        <div className={`${currentRoute === item.name ? 'active' : ''}`}>
          {
            this.listIcon[item.name][
              currentRoute === item.name ? 'active' : 'on'
            ]
          }
        </div>
        <div
          className={`${
            currentRoute === item.name ? 'active' : ''
          } link-btn-label ${hideLabel && !isMobile && 'link-btn-hide'}`}
        >
          {this.translate(`${item.label}`)}
        </div>
      </Link>
    );
  }

  renderMenuButton(item, classes, isMobile) {
    let hideLabel = !this.state.enableMotion;
    const {
      attendanceNotes: { isVisible },
    } = this.props;
    return (
      <div
        className={`${classes} pointer ${isVisible ? 'active' : ''}`}
        onClick={this[item.onClickHandlerName].bind(this)}
      >
        <div>{this.listIcon[item.name][isVisible ? 'active' : 'on']}</div>
        <div
          className={`${isVisible ? 'active' : ''} link-btn-label ${
            hideLabel && !isMobile && 'link-btn-hide'
          }`}
        >
          {this.translate(`${item.label}`)}
        </div>
      </div>
    );
  }

  renderMenuOpts = (
    customerId,
    accountId,
    currentRoute,
    isCustomer,
    customerProgramType,
    isMobile,
  ) => {
    const linkClass = 'db tc no-underline link-btn';
    const generatedOptions = menuOpts(
      accountId,
      customerId,
      customerProgramType,
      isMobile,
    );
    const widthClassName = !isMobile ? 'w-100' : 'w-19';

    return generatedOptions
      .filter((opt) => (opt.attendantOnly ? !isCustomer : true))
      .map((item, index) => (
        <li
          key={index}
          data-testid={item.name}
          className={`tc link-btn-container ${widthClassName} ${item.name}`}
        >
          <div className="recoil">
            {item.to &&
              this.renderMenuLink(item, linkClass, currentRoute, isMobile)}
            {item.onClickHandlerName &&
              this.renderMenuButton(item, linkClass, isMobile)}
          </div>
        </li>
      ));
  };

  handleClickExpandMenu = (status) => {
    if (status && sessionStorage.enableMotion) {
      sessionStorage.removeItem('enableMotion');
    } else {
      sessionStorage.setItem('enableMotion', true);
    }
    this.setState({
      enableMotion: !status,
    });
  };

  render() {
    const vh100Safe = vh100SafeCSSClass();
    const ulClasses = 'list pa0 ma0';
    const {
      match: {
        params: { accountId, customerId },
      },
      ui,
      user,
      customer,
    } = this.props;
    const { currentRoute, isMobile } = ui;
    const navClasses = `v-top menu-vertical ${isMobile ? '' : vh100Safe}`;
    const { isCustomer } = user;
    const {
      program: { type_name: customerProgramType },
    } = customer;
    const profileSubviews = ['cards'];
    const profileSubviewsLimits = ['spening-limits'];
    const statementsSubviews = ['dispute'];
    const supportSubviews = ['support'];
    const { enableMotion, clientId } = this.state;
    let activeItem = currentRoute;

    if (isMobile && profileSubviews.includes(currentRoute)) {
      activeItem = 'cards';
    }
    if (isMobile && profileSubviewsLimits.includes(currentRoute)) {
      activeItem = 'profileParams';
    }

    if (statementsSubviews.includes(currentRoute)) {
      activeItem = 'statements';
    }
    if (isMobile && supportSubviews.includes(currentRoute)) {
      activeItem = 'support';
    }

    return (
      <nav
        className={`${navClasses} ${
          enableMotion && !isMobile && 'menu-vertical-grow'
        }`}
      >
        <Notes />
        {!isMobile && (
          <div
            className="menu-vertical-expand-btn"
            onClick={() => this.handleClickExpandMenu(this.state.enableMotion)}
          >
            <img
              src={enableMotion ? chevronLeft : chevronRight}
              className={
                enableMotion ? 'icon-cheron-left' : 'icon-cheron-right'
              }
              alt="ícone de expansão do menu"
            />
          </div>
        )}
        <div className="menu-header">
          <img src={bars} alt="ícone da aplicação" />
          <span
            className={`menu-header-label ${
              !this.state.enableMotion && 'link-btn-hide'
            }`}
          >
            CustomerApp
          </span>
        </div>
        <ul className={ulClasses}>
          {this.renderMenuOpts(
            accountId,
            customerId,
            activeItem,
            isCustomer,
            customerProgramType,
            isMobile,
          )}
        </ul>

        <div className="menu-footer">
          <span className="menu-footer-label">{`v${version}`}</span>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ ui, user, customer, attendanceNotes }, props) => ({
  ui,
  user,
  customer,
  attendanceNotes,
  ...props,
});

export default connect(mapStateToProps)(withRouter(injectIntl(MenuVertical)));
