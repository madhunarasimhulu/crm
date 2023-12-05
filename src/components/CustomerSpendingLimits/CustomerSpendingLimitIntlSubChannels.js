import { Button, Checkbox, Loader, TextInput } from '../commons';
import { INTL_ATM_SPEND_LIMIT } from './CustomerSpendingLimitsChannel.utils';
const { FormattedDate, injectIntl } = require('react-intl');

const CustomerSpendingLimitIntlSubChannels = ({
  intl,
  channel,
  label,
  loading,
  restrictionActivated,
  valueLimit,
  onChangeRestriction,
  onChangeValue,
  dateResetValue,
  withDrawalAmount,
  disabled = false,
}) => {
  const translate = (id) => intl.formatMessage({ id });

  return (
    <>
      <div
        className="tw-rounded tw-border tw-border-accent-light tw-p-4 tw-mb-4"
        style={{ backgroundColor: 'white' }}
      >
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div>
              <strong>{label}</strong>
            </div>
            <div className="atm-wthl-limit-div">
              {channel === INTL_ATM_SPEND_LIMIT ? (
                <small className="atm-wthl-limit">
                  [Limit is 20% of credit limit: {withDrawalAmount}]
                </small>
              ) : (
                ''
              )}
            </div>
          </div>
          <span>
            {loading ? (
              <Loader size="small" />
            ) : (
              <Checkbox
                id={channel}
                checked={!restrictionActivated}
                onChange={disabled ? () => {} : onChangeRestriction}
                disabled={loading || disabled}
              />
            )}
          </span>
        </div>
        {!restrictionActivated && (
          <>
            <div className="tw-flex tw-items-center tw-justify-between tw-mt-4">
              <TextInput
                type="currency"
                label={translate('spendingLimits.value')}
                className="tw-flex-1 tw-mr-2"
                value={valueLimit}
                onChange={disabled ? () => {} : onChangeValue}
                disabled={loading || disabled}
              />
            </div>
            {valueLimit > 0 && dateResetValue && (
              <small>
                {translate('spendingLimits.resetIn')}:&nbsp;
                <FormattedDate
                  value={`${String(dateResetValue).substring(0, 10)}T12:00:00Z`}
                  day="2-digit"
                  month="short"
                  year="numeric"
                />
              </small>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default injectIntl(CustomerSpendingLimitIntlSubChannels);
