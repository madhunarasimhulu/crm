import React, { useState } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash.isnil';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import { isCreditProgramType } from '../../../utils';
import { programTypes } from '../../../constants';
import { CreditProgress } from '..';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './CreditResume.scss';
import GenericModal from '../../GenericModal/GenericModal';
import { Portals } from '../../Portals/Portals';
import TransferModal from '../../TransferModal';
import { FormatMoney } from '../..';
import { showToast } from 'actions';

const slideClasses = 'relative pv3 tc pismo-gray';

function CurrencyValueComponent(props) {
  if (isNil(props.value)) return null;

  const currency = props.currency ? props.currency : props.org.currency;

  return (
    <div>
      <span className={`b ${props.className}`}>{currency} </span>
      <span className={`b ${props.className}`}>
        <FormatMoney value={props.value} />
      </span>
    </div>
  );
}

const mapStateToProps = ({ org }, props) => ({
  org,
  ...props,
});

const CurrencyValue = connect(mapStateToProps)(
  injectIntl(CurrencyValueComponent),
);

const CreditResume = (props) => {
  const {
    available,
    programType,
    currentStatementInfo,
    nextStatementInfo,
    limits,
    routeWatcher,
    dispatch,
    org,
  } = props;

  const [showModalTransfer, setShowModalTransfer] = useState(false);

  const total_overdraft_limit = limits ? limits.total_overdraft_limit : 0;

  const total = available + total_overdraft_limit;

  let arrChild = [
    <div className={slideClasses} key="firstItemCreditResume00">
      <div className="f7 f6-ns fw4">
        {isCreditProgramType(programType) ? (
          <FormattedMessage id="totalAvailable" />
        ) : (
          <FormattedMessage id="availableBalance" />
        )}
      </div>
      <h3 className="ma0 pv2 f3 pismo-bright-blue">
        {isNil(available) ? (
          <div>...</div>
        ) : (
          <div>
            {programType === programTypes.DEBIT ? (
              <CurrencyValue value={total} />
            ) : (
              <CurrencyValue value={available} />
            )}
            {org?.allowTransferDebit &&
              programType === programTypes.DEBIT &&
              total > 0 && (
                <a
                  href
                  className="btn-transfer"
                  onClick={() => {
                    setShowModalTransfer(true);
                  }}
                >
                  <FormattedMessage id="credit-resume-transfer" />
                </a>
              )}
            {isCreditProgramType(programType) && (
              <div className="w-70 center mt2 mb3">
                <CreditProgress {...props} />
              </div>
            )}
          </div>
        )}
      </h3>
      {programType === programTypes.DEBIT && (
        <div>
          <div className="flex justify-center pismo-bright-blue f6">
            <div className="mr2">
              <FormattedMessage id="over_balance" />:
            </div>
            <CurrencyValue value={available} className="fw4" />
          </div>
          <div className="flex justify-center pismo-bright-blue f6 mt1">
            <div className="mr2">
              <FormattedMessage id="overdraft_limit" />:
            </div>
            <CurrencyValue value={total_overdraft_limit} className="fw4" />
          </div>
        </div>
      )}
    </div>,
  ];

  if (isCreditProgramType(programType) && !isNil(currentStatementInfo.value)) {
    arrChild.push(
      <div
        className={slideClasses}
        key={`${currentStatementInfo.dueDate}CreditResumeItemCurrent${currentStatementInfo.value}`}
      >
        <div className="f7 f6-ns fw4">
          {currentStatementInfo.dueDate && (
            <>
              <span className="display-block">
                <FormattedMessage id="credit-resume-current-statement" />
              </span>
              <span>
                <FormattedMessage id="credit-resume-current-statement-due-date" />
                <FormattedDate
                  value={currentStatementInfo.dueDate}
                  day="2-digit"
                  month="short"
                />
              </span>
            </>
          )}
        </div>
        <h3 className="ma0 pv2 f3 white-important">
          <CurrencyValue value={currentStatementInfo.value} />
        </h3>
      </div>,
    );
  }

  if (isCreditProgramType(programType) && !isNil(nextStatementInfo.value)) {
    arrChild.push(
      <div
        className={slideClasses}
        key={`${nextStatementInfo.dueDate}CreditResumeItemNext${nextStatementInfo.value}`}
      >
        <div className="f7 f6-ns fw4">
          {nextStatementInfo.dueDate && (
            <>
              <span className="display-block">
                <FormattedMessage id="credit-resume-next-statement" />
              </span>
              <span>
                <FormattedMessage id="credit-resume-next-statement-due-date" />
                <FormattedDate
                  value={nextStatementInfo.dueDate}
                  day="2-digit"
                  month="short"
                />
              </span>
            </>
          )}
        </div>
        <h3 className="ma0 pv2 f3 white-important">
          <CurrencyValue value={nextStatementInfo.debits} />
        </h3>
      </div>,
    );
  }

  const translate = (id) => props.intl.formatMessage({ id });

  return (
    <>
      <div className="CreditResume relative z-1 bg-pismo-darker-grayish-blue shadow-pismo-1">
        <Carousel
          showArrows={false}
          showStatus={false}
          showThumbs={false}
          autoPlay={false}
          emulateTouch
          swipeable
          interval={3000000}
          showIndicators={arrChild.length > 1}
        >
          {arrChild}
        </Carousel>
      </div>
      {showModalTransfer && (
        <Portals>
          <GenericModal
            onSubmit={() => {}}
            showTitle={false}
            showSubmitButton={false}
            showClose={false}
          >
            <TransferModal
              onClose={() => setShowModalTransfer(false)}
              limit_transfer={total}
              onSuccess={() => {
                setShowModalTransfer(false);
                dispatch(
                  showToast({
                    message: translate('transfer-modal-success'),
                  }),
                );
                routeWatcher.reload();
              }}
              onError={() => {
                setShowModalTransfer(false);
                dispatch(
                  showToast({
                    message: translate('transfer-modal-error'),
                    style: 'error',
                  }),
                );
              }}
            />
          </GenericModal>
        </Portals>
      )}
    </>
  );
};

CreditResume.propTypes = {
  available: 0,
};

CreditResume.propTypes = {
  available: PropTypes.number,
};

const mapStateToPropsCreditResume = ({ routeWatcher, org }, props) => ({
  routeWatcher,
  org,
  ...props,
});

export default connect(mapStateToPropsCreditResume)(injectIntl(CreditResume));
