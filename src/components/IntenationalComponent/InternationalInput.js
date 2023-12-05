import { Button, Checkbox, Loader, TextInput } from '../commons';
const { FormattedDate, injectIntl } = require('react-intl');

const InternationalInput = ({
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
  disabled = false,
}) => {
  const translate = (id) => intl.formatMessage({ id });

  return (
    <>
      <div
        className={`tw-rounded tw-p-4 ${
          valueLimit > 0 && dateResetValue ? '' : 'tw-mb-4'
        }`}
        // style={{ backgroundColor: 'white' }}
      >
        {!restrictionActivated && (
          <>
            <div className="tw-flex tw-items-center tw-justify-between  tw-mt-4">
              <TextInput
                type="currency"
                label={label}
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

export default injectIntl(InternationalInput);
