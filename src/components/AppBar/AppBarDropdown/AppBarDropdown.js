/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { MdArrowDropDown } from 'react-icons/md';
import { Auth42CS, Customers } from '../../../clients';
import {
  getCustomerDetail,
  getTimelineEvents,
  resetTimelineItems,
  setCurrentRoute,
  updateUser,
} from '../../../actions';
import { logError, isDescendant } from '../../../utils';
import '.././AppBarUser/AppBarUser.scss';
import { Loader } from 'components/commons';
import showBlockedModal from 'actions/showBlockedModal';
import saveCustomerOnboardAccountData from 'actions/saveCustomerOnboardAccountData';
const applicantAccepted = 'Accepted applicant'.toLowerCase();

class AppBarDropdown extends Component {
  state = {
    isSubMenuOpen: false,
    currentProgram: '',
    programId: '',
    documentId: '',
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleAppBarUserBlur = (event) => {
    const parent = document.getElementsByClassName('appbar-dropdown')[0];
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

  closeSubMenu() {
    this.setState({
      isSubMenuOpen: false,
    });
  }

  handleProgramBasedAccount = async (info) => {
    this.setState({
      currentProgram: info?.account_id,
      programId: info?.program_id,
      documentId: info?.document_id,
    });
    const { dispatch } = this.props;
    const data = {
      documentId: info?.document_id,
      accountId: info?.account_id,
    };
    Auth42CS.loginwithAccountId(data)
      .then(async (response) => {
        if (response?.data) {
          const { account_id, token, document_number, tenant, customer_id } =
            response.data;
          sessionStorage.setItem('pismo-document-number', document_number);
          sessionStorage.setItem('pismo-account-id', account_id);
          sessionStorage.setItem('pismo-passport-token', token);
          this.setState({
            isSubMenuOpen: false,
          });
          const { data: accCustomerData, error } =
            await Customers.getAccountStatus(account_id);
          if (error) {
            throw error;
          }
          const {
            email,
            org,
            status,
            status_reason_description,
            status_reason_id,
          } = accCustomerData;

          if (
            status === 'BLOCKED' &&
            String(status_reason_description).toLowerCase() ===
              String(applicantAccepted).toLowerCase() &&
            Number(status_reason_id) !==
              Number(process.env.REACT_APP_MAX_OTP_ATTEMPT_STATUS_REASON_ID)
          ) {
            dispatch(showBlockedModal(false));
            await dispatch(saveCustomerOnboardAccountData(accCustomerData));
            window.location.href = '#/customer-onboard';
          } else if (status === 'NORMAL') {
            dispatch(showBlockedModal(false));
            sessionStorage.setItem('pismo-customer-id', customer_id);
            dispatch(
              updateUser({
                token: token,
                roles: [
                  'account-holder',
                  'account-server',
                  'onboarding-server',
                ],
                email: email,
                tenant: org,
                isCustomer: true,
                accounts: [
                  {
                    account: account_id,
                    customer: customer_id,
                  },
                ],
                status: status,
              }),
            );

            window.location.href = '#/search/?d';
          } else {
            dispatch(showBlockedModal(true));

            dispatch(
              updateUser({
                token: token,
                roles: [
                  'account-holder',
                  'account-server',
                  'onboarding-server',
                ],
                email: email,
                tenant: org,
                isCustomer: true,
                accounts: [
                  {
                    account: account_id,
                    customer: customer_id,
                  },
                ],
                status: status,
              }),
            );

            window.location.href = `#/customers/${customer_id}/accounts/${account_id}/`;
            // window.location.href = '#/search/?d';
          }
        }
      })
      .catch((err) => {
        this.setState({
          isSubMenuOpen: false,
        });
        logError();
      });
  };

  render() {
    const { isSubMenuOpen, currentProgram, programId, documentId } = this.state;
    const { AccProgramTypes, customer } = this.props;
    const { AccountProgramTypes, isLoading, AccountProgramTypesList } =
      AccProgramTypes;

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

    const showActive = {
      background: '#3cb4e0',
      pointerEvents: 'none',
      color: '#ffffff',
    };

    const commonItemClasses = 'bb b--white';
    const clickableItemClasses = `
      ${commonItemClasses}
      hover-pismo-lighter-gray hover-bg-pismo-dark-grayish-blue pointer
    `;

    return (
      <div className="w-100 appbar-dropdown relative z-max AppBarUser">
        <div onClick={this.toggleSubMenu}>
          {AccountProgramTypesList?.items?.map((pname, i) => {
            if (programId != '') {
              if (programId === pname.id) {
                return (
                  <label key={i} className="label-dropdown">
                    {documentId != ''
                      ? documentId
                      : customer?.entity?.document_number}
                    &nbsp; - &nbsp;{pname.name}
                  </label>
                );
              }
            } else if (
              (pname.id === customer?.program?.id && !currentProgram) ||
              pname.id === currentProgram
            ) {
              return (
                <label key={i} className="label-dropdown">
                  {documentId != ''
                    ? documentId
                    : customer?.entity?.document_number}
                  &nbsp; - &nbsp; {pname.name}
                </label>
              );
            }
          })}
          <MdArrowDropDown className="user-btn" />
        </div>

        <div
          className={`${commentBubbleClasses}
            ${isSubMenuOpen ? 'db' : 'dn'}`}
          style={{ top: '2em', right: '0em' }}
        >
          <div style={bubbleHead} />
          <div style={bubbleBody}>
            <div>
              <ul className="list pl0">
                <li className={commonItemClasses}></li>
                <li>
                  {AccountProgramTypes?.length > 0 ? (
                    AccountProgramTypes.map((type, i) => {
                      return (
                        <div
                          key={i}
                          // className={
                          //   type?.account_status === 'BLOCKED'
                          //     ? 'dropDown-blckd-style'
                          //     : ''
                          // }
                        >
                          <div
                            className={`w-100 f6 f5-ns ph3 pv3 ${clickableItemClasses} `}
                            key={i}
                            onClick={() => this.handleProgramBasedAccount(type)}
                            style={
                              (customer?.accountId === type?.account_id &&
                                !currentProgram) ||
                              type.account_id === currentProgram
                                ? showActive
                                : {}
                            }
                          >
                            <span data-testid="test-menu-profile">
                              {AccountProgramTypesList?.items?.map(
                                (ptname, i) => {
                                  if (type.program_id === ptname.id) {
                                    return (
                                      <div
                                        key={i}
                                        style={{
                                          fontSize: '14px',
                                        }}
                                      >
                                        <label>{type?.document_id}</label> -
                                        <label>{ptname?.name}</label>
                                      </div>
                                    );
                                  }
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : isLoading ? (
                    <Loader size="small" />
                  ) : (
                    <li>
                      <div
                        className={`w-100 f6 f5-ns ph3 pv3 ${clickableItemClasses} `}
                      >
                        No Program Types Found
                      </div>{' '}
                    </li>
                  )}
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
  { user, ui, call, credentials, customer, AccProgramTypes, entityTypes },
  props,
) => ({
  user,
  ui,
  call,
  credentials,
  customer,
  AccProgramTypes,

  entityTypes,
  ...props,
});

export default connect(mapStateToProps)(withRouter(injectIntl(AppBarDropdown)));
