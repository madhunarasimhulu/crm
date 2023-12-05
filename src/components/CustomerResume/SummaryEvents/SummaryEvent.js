/* eslint-disable default-case */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-native-reassign */
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import _get from 'lodash.get';
import startOfYesterday from 'date-fns/start_of_yesterday';
import Box from '@material-ui/core/Box';
import { getCurrencyCodeFromNumber } from '../../../utils';
import { FormattedRelativeDate } from '../../commons';
import calculateUsedLimit from './calculateUsedLimit';
import getCSSClassFromTypeCategory from './getCSSClassFromTypeCategory';
import getIconClass from './getIconClass';
import moment from 'moment';

import './SummaryEvent.scss';
import { FormatMoney } from '../..';

const SummaryEvent = (props) => {
  const { event, style, intl, org, onClick } = props;

  if (!event) return;

  const { type, category, timestamp } = event;

  const FormatedWalletNames = {
    APPLE_PAY: 'Apple Pay',
    GOOGLE_PAY: 'Google Pay',
    SAMSUNG_PAY: 'Samsung Pay',
    OTHERS: 'Others',
  };

  // TODO: Validate returned values
  const getValueForEvent = (() => {
    const map = {
      'STATEMENT OVERDUE': (event) => event.data.item.current_balance,
      'STATEMENT CLOSE': (event) => event.data.item.current_balance,
      'STATEMENT CARD_BLOCK': (event) => event.data.item.current_balance,
      'STATEMENT PAYMENT': (event) => event.data.item.local_amount,
      'STATEMENT PARTIAL_PAYMENT': (event) => event.data.item.local_amount,
      // Authorize
      'CONFIRMATION AUTHORIZE': (event) => event.data.item.principal_amount,

      // Payment request received
      'PAYMENT_REQUEST_RECEIVED OPEN': (event) => event.data.item.amount,
      'PAYMENT_REQUEST_RECEIVED SETTLED': (event) => event.data.item.amount,
      'PAYMENT_REQUEST_RECEIVED REJECTED': (event) => event.data.item.amount,
      'PAYMENT_REQUEST_RECEIVED CANCELLED': (event) => event.data.item.amount,
      // Payment request sent
      'PAYMENT_REQUEST_SENT OPEN': (event) => event.data.item.amount,
      'PAYMENT_REQUEST_SENT SETTLED': (event) => event.data.item.amount,
      'PAYMENT_REQUEST_SENT REJECTED': (event) => event.data.item.amount,
      'PAYMENT_REQUEST_SENT CANCELLED': (event) => event.data.item.amount,
      // Intracurrency transfer
      'TRANSFER DEBIT': (event) => event.data.item.amount,
      'PURCHASE DEBIT': (event) => event.data.item.amount,
      'TRANSFER CREDIT': (event) => event.data.item.amount,
      'PURCHASE CREDIT': (event) => event.data.item.amount,
      // In/out via TED TEF
      'CASHIN BANKSLIP': (event) => event.data.item.amount,
      'CASHIN CREDITCARD': (event) => event.data.item.amount,
      'CASHIN TED': (event) => event.data.item.amount,
      'CASHIN TEF': (event) => event.data.item.amount,
      'CASHOUT TED': (event) => event.data.item.amount,
      'CASHOUT TEF': (event) => event.data.item.amount,
      'CASHOUT TRANSFER': (event) => event.data.item.amount,

      'ESTORNO ENCARGOS REFINANCMENTO CREDIT': (event) =>
        event.data.item.amount,
      'ESTORNO IOF CREDIT': (event) => event.data.item.amount,
      'ESTORNO MULTA CREDIT': (event) => event.data.item.amount,
      'ESTORNO JUROS DE MORA CREDIT': (event) => event.data.item.amount,
      'TRANSACTION PARTIAL_CANCELLATION': (event) =>
        event.data.item.principal_amount,

      'CASHIN PAYMENTS': (event) => event.data.item.amount,
      'CASHOUT COMPRA': (event) => event.data.item.amount,
    };
    return (type, category, event) => {
      const key = `${type} ${category}`;
      if (map[key]) return map[key](event);
      if (event.data.item.soft_descriptor)
        return event.data.item.soft_descriptor;
      return '';
    };
  })();

  const getCustomerNameForEvent = (() => {
    const map = {
      // Payment request received
      'PAYMENT_REQUEST_RECEIVED OPEN': (event) => event.data.item.from_name,
      'PAYMENT_REQUEST_RECEIVED SETTLED': (event) => event.data.item.from_name,
      'PAYMENT_REQUEST_RECEIVED REJECTED': (event) => event.data.item.from_name,
      'PAYMENT_REQUEST_RECEIVED CANCELLED': (event) =>
        event.data.item.from_name,
      // Payment request sent
      'PAYMENT_REQUEST_SENT OPEN': (event) => event.data.item.to_name,
      'PAYMENT_REQUEST_SENT SETTLED': (event) => event.data.item.to_name,
      'PAYMENT_REQUEST_SENT REJECTED': (event) => event.data.item.to_name,
      'PAYMENT_REQUEST_SENT CANCELLED': (event) => event.data.item.to_name,
      // Intracurrency transfer
      'TRANSFER DEBIT': (event) => event.data.item.to_name,
      'PURCHASE DEBIT': (event) => event.data.item.to_name,
      'TRANSFER CREDIT': (event) => event.data.item.from_name,
      'PURCHASE CREDIT': (event) => event.data.item.from_name,
      // In/out via TED TEF
      'CASHIN BANKSLIP': (event) => event.data.item.from_name,
      'CASHIN CREDITCARD': (event) => event.data.item.from_name,
      'CASHIN TED': (event) =>
        event.data.item.from_name === null
          ? event.data.item.to_name
          : event.data.item.from_name,
      'CASHIN TEF': (event) => event.data.item.from_name,
      'CASHOUT TED': (event) => event.data.item.to_name,
      'CASHOUT TEF': (event) => event.data.item.to_name,
    };
    return (type, category, event) => {
      const key = `${type} ${category}`;
      if (map[key]) return map[key](event);
      if (event.data.item.soft_descriptor)
        return event.data.item.soft_descriptor;
      return '';
    };
  })();

  const getStatusForEvent = (() => {
    const map = {
      CASHINBANKSLIP: (event) => event.data.item.status,
      CASHINCREDITCARD: (event) => event.data.item.status,
      CASHINTED: (event) => event.data.item.status,
      CASHINTEF: (event) => event.data.item.status,
      CASHOUTTED: (event) => event.data.item.status,
      CASHOUTTEF: (event) => event.data.item.status,
      CASHOUTTRANSFER: (event) => event.data.item.status,
    };
    return (type, category, event) => {
      const key = `${type} ${category}`;
      let returnVal = null;
      if (
        event.data.item.status === undefined &&
        event.data.item.soft_descriptor
      ) {
        returnVal = event.data.item.soft_descriptor;
      } else {
        if (map[key]) {
          returnVal = map[key](event);
        }
      }
      return returnVal;
    };
  })();

  const formatMessage = (id) => <FormattedMessage id={id} />;

  const formatCurrencys = (value, useBold = true) => {
    if (!value) return '';
    const spanClass = useBold ? 'fw7' : '';
    return (
      <span className={spanClass}>
        <FormatMoney value={value} />
      </span>
    );
  };

  const formatDate = (date) => {
    // Use absolute dates for dates before "yesterday"
    if (date < startOfYesterday()) {
      const formatted = intl.formatDate(date, {
        month: 'short',
        day: '2-digit',
      });
      return formatted;
    }

    return <FormattedRelativeDate value={date} />;
  };

  const getLabelForEvent = (type, category) =>
    formatMessage(`event-${type}-${category}`);

  const getCurrencyCode = () => event.currencyCode || org.currency;

  const getTransactionValue = (item) => {
    const isCurrencyBRL = item.currency_code === '986';

    // Transaction value in BRL
    // If the transaction was made in another currency the amount in BRL must be omitted
    let BRLCurrencyAmount = null;
    if (isCurrencyBRL) {
      // New events use "cardholderbilling_amount" and old events use "principal_amount"
      const amount =
        'cardholderbilling_amount' in item
          ? item.cardholderbilling_amount
          : item.principal_amount;
      BRLCurrencyAmount = amount ? (
        <div>
          {getCurrencyCode()}{' '}
          <strong>
            <FormatMoney value={amount} />
          </strong>
        </div>
      ) : null;
    }

    // Transaction value in other currency
    let foreignCurrencyAmount = null;
    if (!isCurrencyBRL) {
      foreignCurrencyAmount = item.local_amount ? (
        <div>
          {getCurrencyCodeFromNumber(item.currency_code)}
          <strong> {formatCurrencys(item.local_amount, false)}</strong>
        </div>
      ) : null;
    }

    // Have instllments?
    let installments = null;
    if (item.number_of_installments && item.number_of_installments > 1) {
      installments = (
        <div>
          {intl.formatMessage(
            {
              id: 'installments',
            },
            { installments: item.number_of_installments },
          )}
        </div>
      );
    }

    return (
      <div>
        {BRLCurrencyAmount}
        {foreignCurrencyAmount}
        {installments}
      </div>
    );
  };

  const renderDescription = (type, category, event) => {
    const item = _get(event, 'data.item');
    let value;
    let customerName;

    if (!item) return null;

    const isPreAuthorization = _get(item, 'inquiry', false);
    const isTokPag = item.context && item.context.toLowerCase() === 'tokpag';

    if (isTokPag) {
      switch (`${type} ${category}`) {
        case 'TRANSFER DEBIT':
        case 'PURCHASE DEBIT':
        case 'TRANSFER CREDIT':
        case 'PURCHASE CREDIT':
          value = getValueForEvent(type, category, event);
          customerName = getCustomerNameForEvent(type, category, event);
          return (
            <div>
              <div className="SummaryEvent__Message">
                {getLabelForEvent('TOKPAG', category)} {customerName}
              </div>
              {value && (
                <div className="SummaryEvent__Value">
                  {getCurrencyCode()} {formatCurrencys(value)}
                </div>
              )}
            </div>
          );
      }
    }

    switch (`${type} ${category}`) {
      case 'TRANSACTION AUTHORIZE':
        return (
          <div>
            {isPreAuthorization === true ? (
              <div className="SummaryEvent__Message">
                <FormattedMessage id="event-PREAUTH" />
              </div>
            ) : null}
            <div className="SummaryEvent__Merchant">{item.soft_descriptor}</div>
            <div className="SummaryEvent__Value">
              {getTransactionValue(item)}
            </div>
          </div>
        );
      case 'TRANSACTION CANCELLATION':
      case 'TRANSACTION REFUSAL':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            <div className="SummaryEvent__Merchant">{item.soft_descriptor}</div>
            <div className="SummaryEvent__Value">
              {getTransactionValue(item)}
            </div>
          </div>
        );
      case 'MDES ACCEPTED':
      case 'TOKENIZATION DENIED':
      case 'TOKENIZATION APPROVED':
        return (
          <div>
            <div className="SummaryEvent__Name">
              {getLabelForEvent(type, category)}:{' '}
              {`${
                FormatedWalletNames[item.wallet]
                  ? FormatedWalletNames[item.wallet]
                  : ''
              }`}
            </div>
          </div>
        );
      case 'CARD CREATION':
      case 'CARD BLOCK':
      case 'CARD UNBLOCK':
      case 'CARD ACTIVATION':
      case 'CARD PRODUCTION':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            <div className="SummaryEvent__Name">
              {item.name} - {item.printed_name}
            </div>
          </div>
        );

      case 'DISPUTE CREATE':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
          </div>
        );
      case 'DISPUTE STATUS':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
          </div>
        );
      case 'CREDIT LIMIT_NEAR':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            <div className="SummaryEvent__Description">
              {intl.formatMessage(
                { id: 'event-CREDIT-LIMIT_NEAR-description' },
                { percent: calculateUsedLimit(event) },
              )}
            </div>
          </div>
        );
      case 'CREDIT LIMIT_REACHED':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            <div className="SummaryEvent__Description">
              {intl.formatMessage(
                { id: 'event-CREDIT-LIMIT_REACHED-description' },
                { percent: calculateUsedLimit(event) },
              )}
            </div>
          </div>
        );
      case 'STATEMENT OVERDUE':
      case 'STATEMENT CLOSE':
      case 'STATEMENT CARD_BLOCK':
        value = getValueForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            {value && (
              <div className="SummaryEvent__Value">
                {getCurrencyCode()} {formatCurrencys(value)}
              </div>
            )}
          </div>
        );

      case 'TRANSFER DEBIT':
      case 'TRANSFER CREDIT':
      case 'TRANSFER CASHIN':
        // case 'TRANSFER CASHOUT':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            <div className="SummaryEvent__Value">
              {getTransactionValue(item)}
            </div>
          </div>
        );

      case 'TRANSFER PAYMENT-REQUEST':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
          </div>
        );

      // TOKPAG events

      // ACCOUNT
      case 'ACCOUNT ACTIVATED':
      case 'ACCOUNT BLOCKED':
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
          </div>
        );

      // Payment request received
      case 'PAYMENT_REQUEST_RECEIVED OPEN':
      case 'PAYMENT_REQUEST_RECEIVED SETTLED':
      case 'PAYMENT_REQUEST_RECEIVED REJECTED':
      case 'PAYMENT_REQUEST_RECEIVED CANCELLED':
        status = getStatusForEvent(type, category, event);
        value = getValueForEvent(type, category, event);
        customerName = getCustomerNameForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              ({formatMessage(category.toLowerCase())}) {customerName}{' '}
              {getLabelForEvent(type, category)} {getCurrencyCode()}{' '}
              {formatCurrencys(value)}
            </div>
          </div>
        );

      // Payment request sent
      case 'PAYMENT_REQUEST_SENT OPEN':
      case 'PAYMENT_REQUEST_SENT SETTLED':
      case 'PAYMENT_REQUEST_SENT REJECTED':
      case 'PAYMENT_REQUEST_SENT CANCELLED':
        status = getStatusForEvent(type, category, event);
        value = getValueForEvent(type, category, event);
        customerName = getCustomerNameForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              ({formatMessage(category.toLowerCase())}){' '}
              {getLabelForEvent(type, category)} {getCurrencyCode()}{' '}
              {formatCurrencys(value)} {formatMessage('for')} {customerName}
            </div>
          </div>
        );

      // In/out
      case 'CASHIN BANKSLIP':
      case 'CASHIN CREDITCARD':
        status = getStatusForEvent(type, category, event);
        value = getValueForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            {value && (
              <div className="SummaryEvent__Value">
                {getCurrencyCode()} {formatCurrencys(value)}
              </div>
            )}
          </div>
        );
      case 'CASHIN TED':
      case 'CASHIN TEF':
      case 'CASHOUT TED':
      case 'CASHOUT TEF':
      case 'CASHOUT TRANSFER':
        status = getStatusForEvent(type, category, event);
        value = getValueForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              ({formatMessage(status.toLowerCase())}){' '}
              {getLabelForEvent(type, category)}
            </div>
            {value && (
              <div className="SummaryEvent__Value">
                {getCurrencyCode()} {formatCurrencys(value)}
              </div>
            )}
          </div>
        );

      case 'CONFIRMATION AUTHORIZE':
        value = getValueForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            {value && (
              <div className="SummaryEvent__Value">
                {getCurrencyCode()} {formatCurrencys(value)}
              </div>
            )}
            {event.data.item.airport_tax && event.data.item.airport_tax > 0 ? (
              <div className="SummaryEvent__Airport">
                {formatMessage(`event-airport`)} {getCurrencyCode()}{' '}
                {formatCurrencys(event.data.item.airport_tax)}{' '}
                {formatMessage(`event-airportTaxMessage`)}
              </div>
            ) : (
              false
            )}
          </div>
        );
      case 'CASHOUT SALES':
      case 'CASHOUT COMPRA':
        const { soft_descriptor, amount } = event.data.item;
        return (
          <div>
            <div className="SummaryEvent__Message">{soft_descriptor}</div>
            {amount && (
              <div className="SummaryEvent__Value">
                {getCurrencyCode()} {formatCurrencys(amount)}
              </div>
            )}
          </div>
        );

      case 'CASHIN SALES':
        value = getValueForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            {value && (
              <div className="SummaryEvent__Value">
                {getTransactionValue(item)}
              </div>
            )}
          </div>
        );
      default:
        value = getValueForEvent(type, category, event);
        return (
          <div>
            <div className="SummaryEvent__Message">
              {getLabelForEvent(type, category)}
            </div>
            {value && (
              <div className="SummaryEvent__Value">
                {getCurrencyCode()} {formatCurrencys(value)}
              </div>
            )}
          </div>
        );
    }
  };

  const themeClasses = getCSSClassFromTypeCategory(type, category);
  const iconClassName = getIconClass(event);
  const classNames = `SummaryEvent ${themeClasses} summaryEvent_item_box`;

  return (
    <Box
      className={classNames}
      style={style}
      onClick={() =>
        onClick({
          ...event?.data?.item,
          timestamp: moment(timestamp).format('ddd, MMMM Do YYYY, h:mm:ss a'),
        })
      }
    >
      <div className="SummaryEvent__Row">
        <div className="SummaryEvent__Icon">
          <span className={iconClassName} />
        </div>
        <h5>{event.data.item.keyItem}</h5>
        <div className="SummaryEvent__Description">
          {renderDescription(type, category, event)}
        </div>
        <div className="SummaryEvent__Date">
          {formatDate(new Date(timestamp))}
        </div>
      </div>
    </Box>
  );
};

export default injectIntl(SummaryEvent);
