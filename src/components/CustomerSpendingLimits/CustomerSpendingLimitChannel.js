import { Button, Checkbox, Loader, TextInput } from '../commons';
const { FormattedDate, injectIntl, FormattedMessage } = require('react-intl');

const CustomerSpendingLimitChannel = ({
  intl,
  channel,
  label,
  loading,
  restrictionActivated,
  valueLimit,
  onChangeRestriction,
  onChangeValue,
  onSaveValue,
  dateResetValue,
  NoSetLimitMessage,
  withDrawalAmount,
  disabled = false,
}) => {
  const translate = (id) => intl.formatMessage({ id });
  return (
    <>
      <div className="tw-rounded tw-border tw-border-accent-light tw-p-4 tw-mb-4 bg-color">
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div>
              <strong>{label}</strong>
            </div>
            <div className="atm-wthl-limit-div">
              {channel === 'atm' ? (
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
                label={`${translate('spendingLimits.value')} ${
                  NoSetLimitMessage ? '(No Channel Limit set)' : ''
                } `}
                className="tw-flex-1 tw-mr-2"
                value={valueLimit}
                onChange={disabled ? () => {} : onChangeValue}
                disabled={loading || disabled}
              />
              <Button
                disabled={loading || disabled}
                text={translate('spendingLimits.confirm')}
                type="button"
                className={`button button--save bg-pismo-yellow basis-0 grow-0 shrink  ${
                  loading ? 'button--disabled' : ''
                }`}
                onClick={disabled ? () => {} : onSaveValue}
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
            <div>
              {valueLimit === 0 && (
                <small>
                  <FormattedMessage id="spendingLimits.channels.infoMessage" />
                </small>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default injectIntl(CustomerSpendingLimitChannel);
