import { Button, Checkbox, Loader, TextInput } from '../commons';
const { FormattedDate, injectIntl } = require('react-intl');

const InternationalToggleButton = ({
  intl,
  channel,
  loading,
  restrictionActivated,
  onChangeRestriction,
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
      </div>
    </>
  );
};

export default injectIntl(InternationalToggleButton);
