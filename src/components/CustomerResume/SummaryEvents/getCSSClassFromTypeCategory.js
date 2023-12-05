const map = {
  'STATEMENT OVERDUE': 'SummaryEvent--Default',
  'STATEMENT CLOSE': 'SummaryEvent--Default',
  'STATEMENT CARD_BLOCK': 'SummaryEvent--Default',
  'STATEMENT PAYMENT': 'SummaryEvent--Payment',
  'STATEMENT PARTIAL_PAYMENT': 'SummaryEvent--Payment',
  'DISPUTE CREATE': 'SummaryEvent--Issue',
  'DISPUTE STATUS': 'SummaryEvent--Issue',
  'CREDIT LIMIT_NEAR': 'SummaryEvent--Default',
  'CREDIT LIMIT_REACHED': 'SummaryEvent--Default',
  'TRANSACTION AUTHORIZE': 'SummaryEvent--Default',
  'TRANSACTION CANCELLATION': 'SummaryEvent--Issue',
  'TRANSACTION REFUSAL': 'SummaryEvent--Issue',
  'CARD CREATION': 'SummaryEvent--Default',
  'CARD ACTIVATION': 'SummaryEvent--Default',
  'CARD DELIVERY': 'SummaryEvent--Default',
  'CARD BLOCK': 'SummaryEvent--Default',
  'CARD UNBLOCK': 'SummaryEvent--Default',
  'CARD PRODUCTION': 'SummaryEvent--Default',
  'MDES ACCEPTED': 'SummaryEvent--Default',
  'TRANSFER DEBIT': 'SummaryEvent--Default',
  'TRANSFER CREDIT': 'SummaryEvent--Default',
  'TRANSFER CASHIN': 'SummaryEvent--Default',
  'TRANSFER CASHOUT': 'SummaryEvent--Default',
  'CONFIRMATION AUTHORIZE': 'SummaryEvent--Default',

  // Tokpag
  'ACCOUNT ACTIVATED': 'SummaryEvent--Default',
  'ACCOUNT BLOCKED': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_RECEIVED OPEN': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_RECEIVED SETTLED': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_RECEIVED REJECTED': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_RECEIVED CANCELLED': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_SENT OPEN': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_SENT SETTLED': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_SENT REJECTED': 'SummaryEvent--Default',
  'PAYMENT_REQUEST_SENT CANCELLED': 'SummaryEvent--Default',
  'CASHIN BANKSLIP': 'SummaryEvent--Default',
  'CASHIN CREDITCARD': 'SummaryEvent--Default',
  'CASHIN TED': 'SummaryEvent--Default',
  'CASHIN TEF': 'SummaryEvent--Default',
  'CASHIN SALES': 'SummaryEvent--Default',
  'CASHOUT TED': 'SummaryEvent--Default',
  'CASHOUT TEF': 'SummaryEvent--Default',
  'CASHOUT TRANSFER': 'SummaryEvent--Default',
  'PURCHASE DEBIT': 'SummaryEvent--Default',
  'PURCHASE CREDIT': 'SummaryEvent--Default',
  'CASHOUT SALES': 'SummaryEvent--Default',

  'TOKENIZATION DENIED': 'SummaryEvent--Issue',
  'TOKENIZATION APPROVED': 'SummaryEvent--Default',

  'CASHIN PAYMENTS': 'SummaryEvent--Payment',
};

export default function getCSSClassFromTypeCategory(type, category) {
  const key = `${type} ${category}`;
  if (map[key]) return map[key];
  return 'SummaryEvent--Default';
}
