/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { MdFlipToBack, MdFileDownload } from 'react-icons/md';
import { MdFlipToFront } from 'react-icons/md';
import {
  toggleStatementView,
  openPayment,
  showToast,
} from '../../../../actions';
import ProgressBar from './ProgressBar';
import { FormatMoney } from '../../..';
import getStatementPdf from 'actions/getStatementPdf';
import formatDate from 'date-fns/format';
import setStatementPdfError from 'actions/setStatementPdfError';

const Header = ({
  dispatch,
  totals,
  currentView,
  isDue,
  isOpen,
  isUpcoming,
  org,
  name,
  isCurrentYear,
  shortYear,
  due_date,
  statements,
  statement,
}) => {
  const toggleView = () => dispatch(toggleStatementView());
  const openPaymentModal = () => dispatch(openPayment());
  const [download, setDownload] = useState(false);
  const [showbtn, setShowBtn] = useState(true);

  const total = totals.main.payment;
  const remainingAmount =
    totals.main.local_balance <= 0 ? 0 : totals.main.local_balance;
  const payed = remainingAmount === 0 ? total : total - remainingAmount;
  const containerClasses = `dt w-100 ph3 ph4-ns pt3 pt4-ns pb2 pb3-ns white ${
    isDue ? 'bg-pismo-pink' : isUpcoming ? 'bg-pismo-mid-gray' : 'bg-pismo-blue'
  }`;
  const toggleBtnClasses =
    'button-reset bg-transparent bn white b f3 f2-ns pointer';
  const enablePayButton = false; // isOpen || isUpcoming || remainingAmount > 0\

  useEffect(() => {
    const nextSelectedMonth = statements?.months.find(
      ({ statement }) =>
        statement.id === statements?.selectedMonth?.statement?.id,
    );
    if (nextSelectedMonth?.posted_date === null) {
      setShowBtn(false);
    }
  }, []);

  const handleStatementPdf = () => {
    setDownload(true);
    let document_number = sessionStorage.getItem('pismo-document-number');
    const nextSelectedMonth = statements?.months.find(
      ({ statement }) =>
        statement.id === statements?.selectedMonth?.statement?.id,
    );
    dispatch(
      getStatementPdf({
        document_id: document_number,
        date: formatDate(
          nextSelectedMonth?.posted_date?.split('T')[0],
          'DD-MM-YYYY',
        ),
      }),
    );
  };

  useEffect(() => {
    if (statements?.downloadStatementPdf?.data.success) {
      const { statement } = statements?.downloadStatementPdf?.data;
      if (download) {
        downloadFileData(statement);
        dispatch(setStatementPdfError({}));
      }
    } else if (statements?.downloadStatementPdf?.data.success === false) {
      dispatch(
        showToast({
          message:
            'The Statement is under process and will be available in few days',
          style: 'error',
        }),
      );
      dispatch(setStatementPdfError({}));
    }
  }, [statements?.downloadStatementPdf?.data.success]);

  const downloadFileData = (filename) => {
    var element = document.createElement('a');
    element.setAttribute('href', filename);
    element.setAttribute('target', '_blank');
    element.setAttribute('rel', 'noreferrer');
    document.body.appendChild(element);
    element.click();
    setDownload(false);
  };

  return (
    <div>
      <div className={containerClasses}>
        <div className="dtc v-mid">
          <div
            className="f7 f5-ns"
            style={{
              textAlign: 'center',
              marginTop: '0px',
              marginBottom: '6px',
            }}
          >
            <span>
              <FormattedMessage id="dueOn" />{' '}
            </span>
            <span>{due_date} </span>
            <span className="ttc">
              <FormattedMessage id={`months.short.${name}`} />
            </span>
            {!isCurrentYear && <span> {shortYear}</span>}
          </div>
          <div className="dib v-mid w-20 tl">
            <button
              type="button"
              className={toggleBtnClasses}
              onClick={toggleView}
            >
              {currentView === 'transactions' ? (
                <MdFlipToBack />
              ) : (
                <MdFlipToFront />
              )}
            </button>
          </div>

          <div className="dib v-mid w-60 tc">
            <h1 className="tc f3 f2-ns pa0 ma0">
              <span className="fw4">{org.currency} </span>
              <span className="b">
                <FormatMoney value={totals.main.payment} />
              </span>
            </h1>

            {!isOpen ? (
              <h2 className="fw4 f6 f5-ns tc pa0 ma0 mt2">
                <FormattedMessage id="minimum" />: {org.currency}{' '}
                <span>
                  <FormatMoney value={totals.main.minimum_payment} />
                </span>
              </h2>
            ) : (
              <h2 className="fw4 f6 f5-ns tc pa0 ma0 mt2">
                <FormattedMessage id="totals.partial.invoice" />
              </h2>
            )}
          </div>

          {enablePayButton && (
            <div className="dib v-mid w-20 tr">
              <a
                className="white bb b--white pb1 ph1 fw4 f6 f5-ns hover-b pointer"
                onClick={openPaymentModal}
              >
                <FormattedMessage id="pay" />
              </a>
            </div>
          )}
          {showbtn ? (
            <MdFileDownload
              size={25}
              onClick={handleStatementPdf}
              className="pointer"
              id="download-Id"
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <ProgressBar
        isDue={isDue}
        isOpen={isOpen}
        isUpcoming={isUpcoming}
        payed={payed}
        total={total}
        currency={org.currency}
      />
    </div>
  );
};

const mapStateToProps = ({ ui, org, statements }, props) => ({
  ui,
  org,
  statements,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(Header));
