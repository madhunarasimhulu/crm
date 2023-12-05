import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import isNil from 'lodash.isnil';
import differenceInDays from 'date-fns/difference_in_days';
import styled from 'styled-components';
import { MdRefresh } from 'react-icons/md';

import './CustomerResume.scss';
import { programTypes, entityTypes } from '../../constants';

import {
  vh100SafeCSSClass,
  parseDateISOString,
  getDueStatementId,
  isCreditProgramType,
} from '../../utils';
import {
  getCustomerDetail,
  getTimelineEvents,
  openPayment,
  resetTimelineItems,
} from '../../actions';
import { Loader, PullToRefresh } from '../commons';
import {
  Avatar,
  ProgramSelector,
  ProgramSelectorTrigger,
  CreditResume,
  WarningDueStatement,
  CustomerInfos,
} from '.';
import SummaryEvents from './SummaryEvents';
import SummryEventDetailsModal from './SummaryEvents/Coral/SummryEventDetailsModal';

function getCurrentMonthStatement(statements) {
  if (!statements || !statements.months) return null;
  return statements.months.filter(
    (statement) => statement.isCurrent === true,
  )[0];
}

function getNextStatement(statements, currentStatement) {
  if (!statements || !statements.months) return null;
  return statements.months
    .filter((item) => item.isUpcoming === true)
    .filter(
      (item) =>
        item.isCurrent === false &&
        item.cicle_closing_date > currentStatement.cicle_closing_date,
    )
    .sort((a, b) => {
      if (a.fullDueDate > b.fullDueDate) return 1;
      if (a.fullDueDate < b.fullDueDate) return -1;
      return 0;
    })[0];
}

function getStatementInfo(statement) {
  if (!statement) {
    return {
      value: null,
      dueDate: '',
      debits: '',
    };
  }

  return {
    value: !isNil(statement.current_balance) ? statement.current_balance : null,
    dueDate: !isNil(statement.fullDueDate)
      ? parseDateISOString(statement.fullDueDate)
      : '',
    debits:
      !isNil(statement.debits) && !isNil(statement.credits)
        ? statement.debits
        : '',
  };
}

const ContainerSumaryEvents = styled.div`
  height: calc(100% - 4.2rem);
`;

const CustomerResume = ({
  customer,
  programSelector,
  history,
  statements,
  timeline,
  dispatch,
  routeWatcher,
  user,
  credentials,
  bankAccounts,
  org,
  BlockedModal,
}) => {
  const {
    entity,
    credit_limits: creditLimits,
    avatar: avatarSrc,
    customerId,
    accountId,
    account: { open_due_date: openDueDate },
    accountStatusCustomer,
    program: { type_name: customerProgramType },
    limits,
  } = customer;
  const { showModalLoading } = BlockedModal;
  const {
    program: { name: programName, id: programId },
  } = customer;

  const [open, setOpen] = useState(false);
  const [modalItem, setModalItem] = useState({});

  const relativeDays = accountStatusCustomer.open_due_date
    ? differenceInDays(new Date(), accountStatusCustomer.open_due_date)
    : 0;

  const statementId = getDueStatementId(openDueDate, statements);

  const vh100Safe = vh100SafeCSSClass();
  const containerClasses = `${vh100Safe} bg-pismo-dark-grayish-blue relative shadow-pismo-4 flex flex-column`;

  const goToProfilePage = () =>
    history.push(`/customers/${customerId}/accounts/${accountId}/profile`);

  const currentStatement = getCurrentMonthStatement(statements);
  const currentStatementInfo = getStatementInfo(currentStatement);
  const nextStatement = getNextStatement(statements, currentStatement);
  const nextStatementInfo = getStatementInfo(nextStatement);

  const openPaymentModal = () => dispatch(openPayment());
  const handleRefresh = () => routeWatcher.reload();
  const isPrepaid =
    customerProgramType === programTypes.PRE_PAID ||
    customerProgramType === programTypes.CHECKING_ACCOUNT;
  const isDebit = !isCreditProgramType(customerProgramType);

  const getAvatarByProgram = () =>
    isPrepaid || isDebit ? (
      <div className="flex self-center">
        <Avatar {...entity} src={avatarSrc} onClick={goToProfilePage} />
        <CustomerInfos entity={entity} bankAccounts={bankAccounts} />
      </div>
    ) : (
      <Avatar {...entity} src={avatarSrc} onClick={goToProfilePage} />
    );

  const doGetTimlineEvents = () => {
    const { isCustomer } = user;
    const { accountId, customerId } = customer;
    const {
      entity: {
        type: { description: entity_type },
      },
    } = customer;

    dispatch(resetTimelineItems());

    if (entity_type === entityTypes.COMPANY) {
      dispatch(getCustomerDetail(customerId, accountId, credentials));
    }

    const timelineEventsParams = {
      pages: 1,
      credentials,
      isCustomer,
      accountId,
      isPrePaid: true,
      shouldStartLoading: true,
      ClickTimlelineReload: true,
    };

    dispatch(getTimelineEvents(timelineEventsParams));
  };

  return (
    <PullToRefresh settings={{ onRefresh: handleRefresh, zIndex: 9999 }}>
      <div className={containerClasses}>
        {showModalLoading ? (
          <div
            className="ph3dot6 pv3dot6 bg-pismo-dark-grey"
            style={{ height: '160px' }}
          >
            <Loader />
          </div>
        ) : (
          <div className="ph3dot6 pv3dot6 bg-pismo-dark-blue">
            {getAvatarByProgram()}
            <ProgramSelectorTrigger
              displayName={!isPrepaid && !isDebit}
              statements={statements}
            />
            {programId != '' && programId != null && programId != undefined ? (
              <div>
                <label className="mv2 f6 flex flex-column program-name">
                  {programName ? programName : ''}
                </label>
                <div className="program-info-div">
                  <div>
                    <label className=" flex flex-column pg-info-clr">
                      PROG ID: {programId}
                    </label>
                  </div>
                  <div>
                    <label className="flex flex-column pg-info-clr">
                      PROG TYPE: &nbsp;
                      {customerProgramType ? customerProgramType : ''}
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        )}
        <SummryEventDetailsModal
          data={modalItem}
          open={open}
          setOpen={setOpen}
        />
        <ProgramSelector isPrepaid={isPrepaid} isDebit={isDebit} />

        {relativeDays > 0 && (
          <WarningDueStatement
            relativeDays={relativeDays}
            customerId={customerId}
            accountId={accountId}
            statementId={statementId}
          />
        )}

        {!programSelector.isOpen && (
          <CreditResume
            {...{ ...creditLimits, limits }}
            programType={customerProgramType}
            currentStatementInfo={currentStatementInfo}
            nextStatementInfo={nextStatementInfo}
            accountId={accountId}
            dispatch={dispatch}
            org={org}
          />
        )}

        {!programSelector.isOpen && (
          <>
            <ContainerSumaryEvents>
              <div className="timeline-Refresh-div">
                {timeline?.isLoading ? (
                  <Loader />
                ) : (
                  <div
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={doGetTimlineEvents}
                  >
                    <label className="refres-label">Refresh</label>
                    <MdRefresh className="timeline-Refresh-btn" />
                  </div>
                )}
              </div>
              {timeline?.isLoading ? (
                <Loader style={{ marginTop: '30px' }} />
              ) : (
                <SummaryEvents
                  payCTAHandler={openPaymentModal}
                  timeline={timeline}
                  user={user}
                  credentials={credentials}
                  accountId={accountId}
                  dispatch={dispatch}
                  org={org}
                  setModalItem={setModalItem}
                  setOpen={setOpen}
                />
              )}
            </ContainerSumaryEvents>
          </>
        )}
      </div>
    </PullToRefresh>
  );
};

CustomerResume.defaultProps = {
  customer: {},
  programSelector: {},
};

CustomerResume.propTypes = {
  customer: PropTypes.object,
  programSelector: PropTypes.object,
};

const mapStateToProps = (
  {
    customer,
    programSelector,
    ui,
    statements,
    timeline,
    user,
    routeWatcher,
    credentials,
    bankAccounts,
    org,
    BlockedModal,
  },
  props,
) => ({
  customer,
  programSelector,
  ui,
  statements,
  timeline,
  user,
  routeWatcher,
  credentials,
  bankAccounts,
  org,
  BlockedModal,
  ...props,
});

export default connect(mapStateToProps)(withRouter(CustomerResume));
