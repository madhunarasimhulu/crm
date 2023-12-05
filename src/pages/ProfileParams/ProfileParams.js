/* eslint-disable react/jsx-key */
import React, { Component } from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { formatDateLocale } from '../../utils';

import differenceInDays from 'date-fns/difference_in_days';
import Observer from 'react-intersection-observer';
import { Link, withRouter } from 'react-router-dom';
import { parse } from 'date-fns';

import Box from '@material-ui/core/Box';
import {
  formatCPFCNPJ,
  vh100SafeCSSClass,
  isCreditProgramType,
} from '../../utils';
import {
  setParamMenuFixed,
  openLimitProposal,
  openPayment,
  openRecharge,
} from '../../actions';
import {
  CustomerPageWrapper,
  CustomerAvatar,
  CardList,
  RechargeModal,
  FormatMoney,
} from '../../components';
import CustomerPersonalInfo from '../../components/CustomerPersonalInfo';
import CustomerPersonalLimits from '../../components/CustomerPersonalLimits';
import CustomerSpendingLimits from '../../components/CustomerSpendingLimits';
import AccountParamsBox from '../../components/AccountParamsBox';
import CustomerChangeStatusForm from '../../components/forms/CustomerChangeStatus';
import paramsMap from './profileParamsDescriptions';
import { programTypes } from '../../constants';
import ProfileParamsMenu from './ProfileParamsMenu';
import ProfileParameterList from './ProfileParamsList';
import { LimitProposalModal } from '.';
import { ProfileParamsFeedbackMessage } from './ProfileParamsFeedbackMessage';

import './ProfileParams.scss';
import CustomFields from 'pages/coral/CustomFields/CustomFields';

class ProfileParams extends Component {
  setMenuFixed = (bool) => this.props.dispatch(setParamMenuFixed(!bool));

  handlePaymentClick = () => {
    this.props.dispatch(openPayment());
  };

  formatListParam = (value, format) => {
    const { org } = this.props;

    if (format === 'money')
      return [`${org.currency} `, <FormatMoney value={value} />];
    if (format === 'date') return this.props.intl.formatDate(new Date(value));
    if (format === 'day') return new Date(0, 0, value).getDate();
    return value;
  };

  handleOpenLimitProposal = () => {
    this.props.dispatch(openLimitProposal());
  };

  handleOpenRecharge = () => {
    this.props.dispatch(openRecharge());
  };

  translate = (id, fallback = '') => {
    const defaultMessage = fallback
      .toLowerCase()
      .replace(/^\w/, (word) => word.toUpperCase());
    return this.props.intl.formatMessage({ id, defaultMessage });
  };

  renderAccountInfo = ({
    linkBasePath,
    user: { isCustomer },
    customer: { account: { account_status: accountStatus } = {} },
    bankAccounts: { accountHolders: { bankaccount = {} } = {} },
    disputeCounts,
  }) => {
    const filterDispute = Object.entries(disputeCounts).filter(
      (dispute) => dispute[0] !== 'DRAFT',
    );

    const disputeLabels = filterDispute.map(([key, value]) => (
      <div className="dib w-50">
        {this.translate(`disputes.${key}`)}: {value}
      </div>
    ));

    const totalDispute = filterDispute.reduce(
      (acc, dispute) => acc + dispute[1],
      0,
    );

    const showOperatorActions = isCustomer ? 'none' : 'block';

    return (
      <ul className="tl ma0 pa0">
        <li className="pa3 f7 f6-ns bb b--pismo-near-white animate-all profile-params-account-info-item">
          <div className="w-100 dib v-mid">
            <p className="pismo-light-silver">
              {this.translate('disputes.total_transactions')}: {totalDispute}
            </p>
            {disputeLabels}
          </div>
        </li>
        <li className="pa3 f7 f6-ns bb b--pismo-near-white animate-all profile-params-account-info-item">
          <div className="w-100 dib v-mid">
            <p className="pismo-light-silver">
              {this.translate('profile.account_number')}
            </p>
            <span>
              {bankaccount.bank
                ? `${bankaccount.bank} / ${bankaccount.account_number}-${bankaccount.check_digit}`
                : 'n/a'}
            </span>
          </div>
        </li>
        <li className="pa3 f7 f6-ns bb b--pismo-near-white animate-all profile-params-account-info-item">
          <div className="w-100 dib v-mid">
            <p className="pismo-light-silver">
              {this.translate('profile.client_since')}
            </p>
            <span>
              {bankaccount.creation_date
                ? this.formatListParam(parse(bankaccount.creation_date), 'date')
                : 'n/a'}
            </span>
          </div>
        </li>
        <li
          style={{ display: showOperatorActions }}
          className="pa3 f7 f6-ns bb b--pismo-near-white animate-all profile-params-account-info-item"
        >
          <div className="w-100 dib v-mid">
            <p className="pismo-light-silver">
              {this.translate('profile.account_status')}
            </p>
            <div className="flex justify-between">
              <span>
                {this.translate(`profile.account_status.${accountStatus}`)}
              </span>
              <Link
                className="customer-action"
                to={`${linkBasePath}/change-status`}
              >
                {this.translate('profile.changeStatus')}
              </Link>
            </div>
          </div>
        </li>
      </ul>
    );
  };

  renderListAccountDetails = () => {
    const {
      profileParams: {
        options: { best_transaction_day, due_date, monthly },
      },
    } = this.props;
    return Object.entries({
      due_date,
      best_transaction_day,
      monthly,
    }).map(([key, value], index) => (
      <ProfileParameterList
        key={index}
        // editable={key === 'due_date'}
        editable={false}
        options={paramsMap[key].options}
        type={paramsMap[key].type}
        name={this.translate(`profile.${key}`)}
        value={this.formatListParam(value, paramsMap[key].format)}
      />
    ));
  };

  renderListAccountParameters = ({ parameters, user: { isCustomer } }) => {
    const enabledParamsName = ['MDR', 'DESCONTO pismo'];

    return parameters
      .filter(({ name }) => enabledParamsName.includes(name))
      .map((item, index) => (
        <ProfileParameterList
          key={item.name}
          item={item}
          type="number"
          name={this.translate(`profile.${item.name}`, item.name)}
          editable={!isCustomer}
          value={`${item.value}%`}
        />
      ));
  };

  render() {
    const { intl } = this.props;
    const {
      customer,
      bankAccounts,
      customer: {
        entity: { name: customerName, document_number },
        avatar: avatarSrc,
      },
      profileParams: {
        options,
        parameters,
        options: { open_due_date },
        menuFixed,
        disputeCounts,
        accountStatusProfile,
        paramsLoading,
      },
      match: { params },
      ui: { isMobile },
      user,
      org,
    } = this.props;

    const {
      program: { type_name: customerProgramType },
    } = customer;

    const isPrePaid =
      customerProgramType === programTypes.CHECKING_ACCOUNT ||
      customerProgramType === programTypes.PRE_PAID;

    const now = new Date(formatDateLocale(new Date(), 'MMM-DD-YYYY', intl));
    const lastTransationDate = open_due_date
      ? new Date(formatDateLocale(new Date(open_due_date), 'MMM-DD-YYYY', intl))
      : now;
    const dueDiffInDays = differenceInDays(now, lastTransationDate);
    const { available, total, minimum_payment, current_balance } = options;
    const difference = open_due_date ? dueDiffInDays > 1 : false;
    const { subview } = params;
    const nextInvoice = [
      `${this.translate(
        `profile.minimum_payment${isMobile ? '_short' : ''}`,
      )}: `,
      `${org.currency} `,
      <FormatMoney value={minimum_payment} />,
    ];
    // const delay = `${dueDiffInDays} ${this.translate('profile.delay')}`;
    const delay = this.translate('profile.delay');
    const { customerId, accountId } = params;
    const linkBasePath = `/customers/${customerId}/accounts/${accountId}/profile`;

    return (
      <CustomerPageWrapper customer={customer}>
        <div className={`${vh100SafeCSSClass()} pv3-ns`}>
          <div className="profile-params w-100 mw6dot5-ns center-ns max-h-100 overflow-y-auto">
            <div className="tc pv2 dn db-ns">
              <div className="pv2 tc center">
                <CustomerAvatar
                  name={customerName || ''}
                  src={avatarSrc}
                  size={96}
                  bigLabel
                />
              </div>
              <div className="mv2 fw4 f4 f3-ns">{customerName}</div>
              <div className="f6 f5-ns fw4 pb1">
                {formatCPFCNPJ(document_number)}
              </div>
              {/* <div className="f6 f5-ns fw4">{customer.email}</div> */}
              <div className="f6 f5-ns fw4">
                {customer?.account?.account_status !== null &&
                customer?.account?.account_status !== undefined
                  ? `${this.translate('profile.menu.account')} ${this.translate(
                      `profile.status.${customer?.account?.account_status}`,
                    )}`
                  : ''}
              </div>
            </div>
            <Observer onChange={this.setMenuFixed} />
            <div
              className={`tc ma0 views-params w-100 z-1 ${
                menuFixed && 'fixed'
              }`}
            >
              <ProfileParamsMenu />
            </div>
            <div
              className={`profile-params-details ${menuFixed && 'fix-pad'} 
               ${
                 customer?.account?.account_status === 'CANCELLED'
                   ? 'cursor-pe-none'
                   : ''
               }
              `}
            >
              {(!subview || subview === '') &&
                isCreditProgramType(customerProgramType) && (
                  <div className="account-params customer-account-view">
                    <div className="flex">
                      <AccountParamsBox
                        title={this.translate('profile.avaliable')}
                        value={<FormatMoney value={available} />}
                        subtitle={[
                          `${org.currency} `,
                          <FormatMoney value={total} />,
                        ]}
                        action={this.translate('profile.change')}
                        onClick={this.handleOpenLimitProposal}
                        paramsLoading={paramsLoading}
                      />

                      <AccountParamsBox
                        title={this.translate('profile.current_invoice')}
                        value={<FormatMoney value={current_balance} />}
                        subtitle={difference ? delay : nextInvoice}
                        classType={difference ? 'item-danger' : 'item-blue'}
                      />
                    </div>

                    {options && (
                      <ul className="tl ma0 pa0 params-list">
                        {options && this.renderListAccountDetails()}
                      </ul>
                    )}

                    {isPrePaid &&
                      this.renderAccountInfo({
                        linkBasePath,
                        user,
                        customer,
                        bankAccounts,
                        disputeCounts,
                      })}
                  </div>
                )}
              {(!subview || subview === '') &&
                customerProgramType === programTypes.DEBIT && (
                  <Box
                    width={1}
                    p="50px"
                    bgcolor="#586374"
                    display="flex"
                    justifyContent="center"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <h4 className="mv0 f5 fw4 white">
                        {this.translate('profile.current_balance')}
                      </h4>
                      <h3 className="mv2 f3 f2-ns white">
                        <span className="fw4">{org.currency} </span>
                        <FormatMoney value={available} />
                      </h3>
                    </Box>
                  </Box>
                )}
              {(!subview || subview === '') && isPrePaid && (
                <div className="account-params customer-account-view">
                  <ul className="tl ma0 pa0 params-list">
                    {this.renderListAccountParameters({ parameters, user })}
                  </ul>
                  {this.renderAccountInfo({
                    linkBasePath,
                    user,
                    customer,
                    bankAccounts,
                    disputeCounts,
                  })}
                </div>
              )}
              {subview === 'info' && (
                <CustomerPersonalInfo
                  customer={customer}
                  accountId={params.accountId}
                  customerId={params.customerId}
                />
              )}
              {subview === 'cards' && <CardList isPrePaid={isPrePaid} />}
              {subview === 'change-status' && <CustomerChangeStatusForm />}
              {subview === 'success' && <ProfileParamsFeedbackMessage />}
              {subview === 'rejected' && (
                <ProfileParamsFeedbackMessage rejected />
              )}
              {subview === 'limits' && <CustomerPersonalLimits />}
              {subview === 'spending-limits' && <CustomerSpendingLimits />}
              {subview === 'custom-fields' && (
                <CustomFields accountId={params.accountId} />
              )}
            </div>
          </div>

          {isCreditProgramType(customerProgramType) && (
            // <LimitProposalModal currentLimit={total} />
            <></>
          )}
          {isPrePaid && <RechargeModal />}
        </div>
      </CustomerPageWrapper>
    );
  }
}

const mapStateToProps = (
  { user, customer, profileParams, cards, bankAccounts, intl, ui, org },
  props,
) => ({
  user,
  customer,
  intl,
  profileParams,
  cards,
  ui,
  bankAccounts,
  org,
  ...props,
});

export default compose(
  connect(mapStateToProps),
  injectIntl,
  withRouter,
)(ProfileParams);
