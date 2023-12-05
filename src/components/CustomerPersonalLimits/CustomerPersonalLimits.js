import React from 'react';
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Loader } from '../commons';

import './CustomerPersonalLimits.scss';
import { FormatMoney } from '..';

const LIMITS_AVAILABLE = [501, 601, 701, 403, 900];
const LIMITS_BANKSLIP_AVAILABLE = [101, 102, 103];
const LIMITS_CHARGE_AVAILABLE = [901, 902];

const itemAnimation = {
  entering: 'o-0 mt3',
  entered: 'o-100',
  exited: 'o-0 mt3',
  exiting: 'o-100',
};

const renderBankSlipEntry = ({ entry: bankSlip, currency }) => {
  // The 102 rule treats units not values
  const formatValue =
    bankSlip.rule_id === 102
      ? (i) => i
      : (value) => <FormatMoney value={value} showSymbol />;
  return (
    <div
      className="CustomerPersonalLimits__row CustomerPersonalLimits__bkg-gray"
      key={bankSlip.rule_id}
    >
      <div className="w-40 f7 mt1 pl0-ns pismo-light-silver">
        <FormattedMessage id={`bankAccounts.${bankSlip.name}`} />
      </div>
      <div className="w-20 db mv1 f4 fw7 tr pismo-blue">
        {bankSlip.rule_id !== 101 &&
          formatValue(bankSlip.amount_limit - bankSlip.amount_in_use, currency)}
      </div>
      <div className="w-20 db mv1 f5-ns normal-ns tr">
        {formatValue(bankSlip.amount_limit, currency)}
      </div>
      <div className="w-20 db mv1 f5-ns normal-ns tr">
        {bankSlip.rule_id !== 101 &&
          formatValue(bankSlip.amount_in_use, currency)}
      </div>
    </div>
  );
};

const renderLimitEntry = ({ entry: limit }) => (
  <div
    className="CustomerPersonalLimits__row CustomerPersonalLimits__bkg-gray"
    key={limit.rule_id}
  >
    <div className="w-40 f7 mt1 pl0-ns pismo-light-silver">
      <FormattedMessage id={`bankAccounts.${limit.name}`} />
    </div>
    <div className="w-20 db mv1 f4 fw7 tr pismo-blue">
      {limit.rule_id === 601 || limit.rule_id === 701 ? (
        false
      ) : (
        <FormatMoney
          value={limit.amount_limit - limit.amount_in_use}
          showSymbol
        />
      )}
    </div>
    <div className="w-20 db mv1 f5-ns normal-ns tr">
      <FormatMoney value={limit.amount_limit} showSymbol />
    </div>
    <div className="w-20 db mv1 f5-ns normal-ns tr">
      <FormatMoney value={limit.amount_in_use} showSymbol />
    </div>
  </div>
);

const renderChargeEntry = ({ entry: charge }) => (
  <div
    className="CustomerPersonalLimits__row CustomerPersonalLimits__bkg-gray"
    key={charge.rule_id}
  >
    <div className="w-40 f7 mt1 pl0-ns pismo-light-silver">
      <FormattedMessage id={`bankAccounts.${charge.name}`} />
    </div>
    <div className="w-20 db mv1 f4 fw7 tr pismo-blue" />
    <div className="w-20 db mv1 f5-ns normal-ns tr">
      <FormatMoney value={charge.amount_limit} showSymbol />
    </div>
    <div className="w-20 db mv1 f5-ns normal-ns tr" />
  </div>
);

const renderLimitsSection = ({ title, entries, renderEntry, emptyMessage }) => (
  <div>
    <div className="w-100 db mt3 f6 f5-ns normal-ns">
      <FormattedMessage id={`bankAccounts.${title}`} />
    </div>
    <div className="CustomerPersonalLimits__row CustomerPersonalLimits__row--header">
      <div className="w-60 f7 mt1 pl0-ns pismo-light-black tr">
        <FormattedMessage id="bankAccounts.available" />
      </div>
      <div className="w-20 f7 mt1 pl0-ns pismo-light-black tr">
        <FormattedMessage id="bankAccounts.total" />
      </div>
      <div className="w-20 f7 mt1 pl0-ns pismo-light-black tr">
        <FormattedMessage id="bankAccounts.used" />
      </div>
    </div>

    {entries.length > 0 ? (
      entries.map((entry) => renderEntry({ entry }))
    ) : (
      <div className="bg-white pv1 f6">
        <Transition appear in timeout={100}>
          {(state) => (
            <div
              className={`pa4 f4-ns tc pismo-light-silver animate-all ${itemAnimation[state]}`}
            >
              <FormattedMessage id={emptyMessage} />
            </div>
          )}
        </Transition>
      </div>
    )}
  </div>
);

const CustomerPersonalLimits = ({
  bankAccounts: { isLoading, limits },
  org,
}) => (
  <section className="CustomerPersonalLimits relative bg-white f6 animate-all">
    {isLoading ? (
      <div className="db cb w-100 pv3 bb b--pismo-lighter-gray animate-all">
        <Loader size="small" />
      </div>
    ) : (
      <div>
        {renderLimitsSection({
          title: 'limits',
          entries: LIMITS_AVAILABLE.reduce((acc, ruleId) => {
            const limit = limits.limits.find(
              ({ rule_id }) => rule_id === ruleId,
            );
            return limit ? [...acc, limit] : acc;
          }, []),
          renderEntry: renderLimitEntry,
          emptyMessage: 'profile.limits.noLimits',
        })}
        {renderLimitsSection({
          title: 'paymentRequests',
          emptyMessage: 'profile.limits.noPaymentRequests',
          entries: LIMITS_CHARGE_AVAILABLE.reduce((acc, ruleId) => {
            const limit = limits.limits.find(
              ({ rule_id }) => rule_id === ruleId,
            );
            return limit ? [...acc, limit] : acc;
          }, []),
          renderEntry: renderChargeEntry,
        })}
        {renderLimitsSection({
          title: 'bankSlips',
          emptyMessage: 'profile.limits.noBankSlipLimits',
          entries: LIMITS_BANKSLIP_AVAILABLE.reduce((acc, ruleId) => {
            const limit = limits.bankSlips.find(
              ({ rule_id }) => rule_id === ruleId,
            );
            return limit ? [...acc, limit] : acc;
          }, []),
          renderEntry: (props) => {
            renderBankSlipEntry({
              ...props,
              currency: org.currency,
            });
          },
        })}
      </div>
    )}
  </section>
);

const mapStateToProps = (
  { user, credentials, customer, bankAccounts, org },
  props,
) => ({
  user,
  credentials,
  customer,
  bankAccounts,
  org,
  ...props,
});

export default compose(connect(mapStateToProps))(
  injectIntl(CustomerPersonalLimits),
);
