import React, { Fragment, useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedDate, FormattedMessage } from 'react-intl';
import { formatCPF } from '../../../utils';

const CustomerInfos = (props) => {
  const { bankaccount } = props?.bankAccounts?.accountHolders;
  const { entity } = props;
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    if (!bankaccount && props?.org?.allowAccountStatusChange) {
      setShowStatus(false);
    }
  }, [bankaccount]);

  // TO-DO: Implement formatCNPJ after the branch wich contais this feature be merged
  return (
    <div className="mv2 f6 white flex flex-column">
      {entity.name && (
        <span className="flex self-start mb1 b">{entity.name}</span>
      )}
      {entity.email && (
        <span className="flex self-start mb1">{entity.email}</span>
      )}
      {entity.document_number && (
        <span className="flex self-start mb1">
          {formatCPF(entity.document_number)}
        </span>
      )}
      {bankaccount && (
        <>
          <span className="flex self-start mb1">
            {bankaccount.bank} - {bankaccount.branch}/
            {bankaccount.account_number}-{bankaccount.check_digit}
          </span>
          <span className="flex self-start mb1">
            <FormattedDate
              timezone="America/Sao_Paulo"
              value={bankaccount.creation_date}
              year="2-digit"
              month="short"
              day="2-digit"
            />
            &nbsp;-&nbsp;
            <FormattedMessage
              id={`profile.account_status.${props.customer.account.account_status}`}
            />
          </span>
        </>
      )}

      {showStatus ? (
        <FormattedMessage id={`profile.account_status.LOADING`} />
      ) : props?.customer?.account?.account_status === 'NORMAL' ||
        props?.customer?.account?.account_status === 'ACTIVE' ? (
        <div>
          <strong>Status:</strong>
          <FormattedMessage
            id={`profile.account_status.${
              props?.customer?.account?.account_status === 'NORMAL' ||
              props?.customer?.account?.account_status === 'ACTIVE'
                ? 'ACTIVE'
                : 'DORMANT'
            }`}
          />
        </div>
      ) : (
        <FormattedMessage id={`profile.account_status.LOADING`} />
      )}
    </div>
  );
};

CustomerInfos.propTypes = {
  entity: PropTypes.object,
  bankAccounts: PropTypes.object,
};

const mapStateToProps = ({ user, credentials, customer, org }, props) => ({
  user,
  credentials,
  customer,
  org,
  ...props,
});

export default compose(connect(mapStateToProps), injectIntl)(CustomerInfos);
