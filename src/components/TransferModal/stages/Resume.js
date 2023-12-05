import { FormattedMessage, injectIntl } from 'react-intl';

import { ReactComponent as ResumeIcon } from '../../../assets/img/resume.svg';

import styles from './Resume.module.css';
import stylesModal from '../TransferModal.module.css';
import Card from './Card';
import { FormatMoney } from 'components';

const Resume = ({ accountDestination, amount, onConfirm }) => {
  return (
    <div className="tw-px-10">
      <h3 className="f3 fw4" style={{ textAlign: 'left' }}>
        <FormattedMessage id="transfer-modal-check-data" />
      </h3>
      <ResumeIcon className={styles.transfer_resume_image} />
      <div className={styles.transfer_amount}>
        <FormattedMessage id={'transfer-modal-of'} />
        <br />
        <span className={styles.transfer_value}>
          <FormatMoney value={amount} />
        </span>
        <br />
        <FormattedMessage id={'transfer-modal-to'} />
      </div>
      <div className="tw-mt-4">
        <Card account={accountDestination} />
      </div>
      <div className="tw-mt-5">
        <button
          onClick={() => onConfirm()}
          className={`${stylesModal['btn-transfer']} `}
        >
          <FormattedMessage id={'transfer-modal-confirm'} />
        </button>
      </div>
    </div>
  );
};

export default injectIntl(Resume);
