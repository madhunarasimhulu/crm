import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

const WarningDueStatement = ({
  relativeDays,
  customerId,
  accountId,
  statementId,
}) => {
  const dueStatementPagePath = `/customers/${customerId}/accounts/${accountId}/statements/${statementId}`;

  return (
    <div className="pv3 pt4 tc bg-pismo-pink white">
      <Link to={dueStatementPagePath} className="white">
        <FormattedMessage id="warningDueStatement.dueDays" />: {relativeDays}
      </Link>
    </div>
  );
};

const mapStateToProps = ({ ui }, props) => ({
  ui,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(WarningDueStatement)),
);
