const events = {
  'event-empty-message': 'There are no events to list.',
  'event-error-fetching-message': 'Unable to fetch the event list.',
  'events-pay-now-cta': 'Make a payment',
  'event-STATEMENT-OVERDUE': 'Statement overdue.',
  'event-STATEMENT-CLOSE': 'Closed statement.',
  'event-STATEMENT-CARD_BLOCK': 'Card locked due to late billing.',
  'event-STATEMENT-PAYMENT': 'Payment received!',
  'event-STATEMENT-PARTIAL_PAYMENT': 'Payment received!',
  'event-CONFIRMATION-CANCELLATION': 'Cancellation confirmation.',
  'event-CREDIT-LIMIT_NEAR': 'Limit alert!',
  'event-CREDIT-LIMIT_NEAR-description':
    'You have used more than {percent}% of your limit.',
  'event-CREDIT-LIMIT_REACHED': 'Full limit used.',
  'event-CREDIT-LIMIT_REACHED-description':
    "You've used your entire credit limit.",
  'event-TRANSACTION-CANCELLATION': 'Cancelled transaction.',
  'event-TRANSACTION-REFUSAL': 'Refused transaction.',
  'event-CARD-CREATION': 'Card created.',
  'event-CARD-ACTIVATION': 'Card activated.',
  'event-CARD-DELIVERY':
    "We've noticed you received your card. Unblock it now.",
  'event-CARD-BLOCK': 'Card blocked.',
  'event-CARD-UNBLOCK': 'Unblocked card successfully!',
  'event-CARD-PRODUCTION': 'Card produced.',
  'event-MDES-ACCEPTED': 'Card accepted',
  'event-DISPUTE-CREATE': 'Reported transaction.',
  'event-dispute-status': 'DISPUTE STATUS',
  'event-DISPUTE ANALYSING': 'DISPUTE ANALYSING',
  'event-DISPUTE CLIENT_CREDIT': 'DISPUTE CLIENT_CREDIT',
  'event-DISPUTE-CLOSED_ISSUER_LOSS': 'DISPUTE-CLOSED_ISSUER_LOSS',
  'event-DISPUTE-TEMPORARY_ISSUER_LOSS': 'DISPUTE-TEMPORARY_ISSUER_LOSS',
  'event-PREAUTH': 'Pre-authorization.',
  'event-TRANSFER-CASHIN': 'Tranfer: CashIn',
  'event-TRANSFER-CASHOUT': 'Tranfer: CashOut',
  'event-TRANSFER-CREDIT': 'Tranfer: Credit',
  'event-TRANSFER-DEBIT': 'Tranfer: Debit',
  'event-TRANSFER-CREDITCARD': 'Pismo by credit card',
  'event-TRANSFER_REVERSAL-CREDITCARD': 'Pismo by credit card canceled',
  'event-TRANSFER-PAYMENT-REQUEST': 'Tranfer Request',
  'event-CONFIRMATION-AUTHORIZE': 'Confirmation authorization',
  'event-PURCHASE-DEBIT': 'purchase',
  'event-PURCHASE_REVERSAL-DEBIT': 'purchase canceled',
  'event-PURCHASE-CREDIT': 'purchase',
  'event-PURCHASE_REVERSAL-CREDIT': 'purchase canceled',
  'event-PURCHASE-CREDITCARD': 'purchase by credit card',
  'event-PURCHASE_REVERSAL-CREDITCARD': 'purchase by credit card canceled',
  'event-ADJUSTMENT_CANCELAMENTO DE COMPRA-CREDIT':
    'credit card cancellation adjustment',
  'event-ADJUSTMENT-CREDIT': 'Adjustment credit',
  'event-ADJUSTMENT-DEBIT': 'Adjustment debit',
  'event-DISPUTE-CLOSED_ISSUER_LOSS': 'Dispute closed issuer loss',
  'event-DISPUTE-ANALYSING': 'Dispute analysing',
  'event-DISPUTE-OPEN': 'Dispute open',
  'event-dispute-open': 'Dispute open',
  'event-DISPUTE-STATUS': 'Dispute status update',
  'event-dispute-status': 'Dispute status update',
  'event-DEBIT-TRANSFER': 'Debit transfer',
  'event-REVERSAO DE DEBITO-CREDIT': 'Debit/credit adjustment',
  'event-CASHOUT-PAYMENT_ORDER': 'Cashout payment order',
  'event-TRANSACTION-REFERRAL': 'Transaction referral',

  // events
  'event-ACCOUNT-ACTIVATED': 'Activated account',
  'event-ACCOUNT-BLOCKED': 'Blocked account',
  'event-PAYMENT_REQUEST_RECEIVED-OPEN': 'requested a payment of',
  'event-PAYMENT_REQUEST_RECEIVED-SETTLED': 'requested a payment of',
  'event-PAYMENT_REQUEST_RECEIVED-REJECTED': 'requested a payment of',
  'event-PAYMENT_REQUEST_RECEIVED-CANCELLED': 'requested a payment of',
  'event-PAYMENT_REQUEST_SENT-OPEN': 'You requested a payment of',
  'event-PAYMENT_REQUEST_SENT-SETTLED': 'You requested a payment of',
  'event-PAYMENT_REQUEST_SENT-REJECTED': 'You requested a payment of',
  'event-PAYMENT_REQUEST_SENT-CANCELLED': 'You requested a payment of',
  'event-CASHIN-BANKSLIP': 'Bankslip deposit',
  'event-CASHIN-CREDITCARD': 'Credit card deposit',
  'event-CASHIN-TED': 'TED deposit',
  'event-CASHIN-TEF': 'TEF deposit',
  'event-CASHOUT-TED': 'TED withdrawal',
  'event-CASHOUT-TEF': 'TEF withdrawal',
  'event-CASHOUT-TRANSFER': 'TRANSFER withdrawal',
  'event-TOKPAG-DEBIT': 'Pismo sent to',
  'event-TOKPAG-CREDIT': 'Pismo received from',
  'event-BANKSLIP-OVERDUE': '',
  'event-BANKSLIP-CANCELLED': '',
  'event-BANKSLIP-REGISTERED': '',
  'event-BANKSLIP-SETTLED': '',
  'event-CASHOUT_REVERSAL-TED': '',
  'event-CASHOUT_REVERSAL-TEF': '',
  'event-CASHIN_REVERSAL-TED': '',
  'event-CASHIN_REVERSAL-TEF': '',
  'event-BLOQUEIO JUDICIAL-DEBIT': 'block by judicial order',
  'event-CASHOUT-PAYMENTS': 'Pay',
  'event-ESTORNO ENCARGOS REFINANCMENTO-CREDIT':
    'Chargeback refinancing charges',
  'event-ESTORNO IOF-CREDIT': 'IOF chargeback',
  'event-ESTORNO MULTA-CREDIT': 'Fine chargeback',
  'event-ESTORNO JUROS DE MORA-CREDIT': 'Interest chargeback',
  'event-TRANSACTION-PARTIAL_CANCELLATION': 'Partial cancellation',
  'event-airport': 'It will be added the value of',
  'event-airportTaxMessage':
    'referring to the shipping fee, charged in the first installment.',
  'ADJUSTMENT CREDIT': 'Pismo adjustment',
  'ADJUSTMENT DEBIT': 'Pismo adjustment',

  // New events
  'BANKSLIP REGISTERED': 'Bankslip registered',
  'BANKSLIP CANCELLED': 'Bankslip canceled',
  'BANKSLIP SETTLED': 'Bankslip paid',
  'BANKSLIP OVERDUE': 'Bankslip expired',
  'BANKSLIP CASHIN': 'Charge by bank slip',

  'TRANSFER DEBIT': 'Pismo sent to {to_name}',
  'TRANSFER CREDIT': 'Pismo received from {from_name}',
  'TRANSFER CREDITCARD': 'Pismo by credit card sent to {to_name}',
  'TRANSFER_REVERSAL CREDITCARD':
    'Pismo by credit card sent to {to_name} canceled',
  'TRANSFER CREDITCARD PISMO': 'Pismo by credit card sent to {to_name}',
  'TRANSFER_REVERSAL DEBIT': 'Transfer reversal',
  'CASHIN BANKSLIP': 'Charge via bankslip',
  'CASHIN CREDITCARD': 'Charge via credit card',

  'CASHIN TED PROCESSED': 'TED received from {from_name}',
  'CASHIN TED CANCELLED': 'TED received from {from_name}',
  'CASHIN TED REFUNDED': 'TED received from {from_name}',

  'CASHOUT TED PROCESSED': 'TED sent to {to_name}',
  'CASHOUT TED CANCELLED': 'TED sent to {to_name}',
  'CASHOUT TED REFUNDED': 'TED sent to {to_name}',

  'CASHIN TEF PROCESSED': 'TEF received from {from_name}',
  'CASHIN TEF CANCELLED': 'TEF received from {from_name}',
  'CASHIN TEF REFUNDED': 'TEF received from {from_name}',

  'CASHOUT TEF PROCESSED': 'TEF sent to {to_name}',
  'CASHOUT TEF CANCELLED': 'TEF sent to {to_name}',
  'CASHOUT TEF REFUNDED': 'TEF sent to {to_name}',

  'PAYMENT_REQUEST_RECEIVED OPEN':
    '{from_name} requested a payment of {amount}',
  'PAYMENT_REQUEST_RECEIVED SETTLED':
    '{from_name} requested a payment of {amount}',
  'PAYMENT_REQUEST_RECEIVED REJECTED':
    '{from_name} requested a payment of {amount}',
  'PAYMENT_REQUEST_RECEIVED CANCELLED':
    '{from_name} requested a payment of {amount}',

  'PAYMENT_REQUEST_SENT OPEN':
    'You requested a payment of {amount} to {to_name}',
  'PAYMENT_REQUEST_SENT SETTLED':
    'You requested a payment of {amount} to {to_name}',
  'PAYMENT_REQUEST_SENT REJECTED':
    'You requested a payment of {amount} to {to_name}',
  'PAYMENT_REQUEST_SENT CANCELLED':
    'You requested a payment of {amount} to {to_name}',

  'PURCHASE DEBIT TOKPAG': 'Purchase debit Pismo',
  'PURCHASE CREDIT TOKPAG': 'Purchase credit Pismo',

  'PURCHASE DEBIT': 'Purchase debit Pismo',
  'PURCHASE CREDIT': 'Purchase credit Pismo',
  'PURCHASE_REVERSAL DEBIT': 'Purchase debit Pismo canceled',
  'PURCHASE_REVERSAL CREDIT': 'Purchase credit Pismo canceled',
  'PURCHASE CREDITCARD': 'Purchase credit card at {to_name}',
  'PURCHASE_REVERSAL CREDITCARD': 'Purchase credit card at {to_name} canceled',

  'ACCOUNT ACTIVATED TOKPAG': 'Activated account',
  'ACCOUNT BLOCKED TOKPAG': 'Temporarily blocked account',

  'TRANSACTION AUTHORIZE': 'Transaction autorized',

  'CASHOUT TED': 'TED sent to {to_name}',
  'CASHIN TED': 'TED received from {from_name}',
  'CASHOUT TEF': 'TEF sent to {to_name}',
  'CASHIN TEF': 'TEF received from {from_name}',
  'CASHOUT PAYMENT_ORDER PROCESSED': 'CASHOUT PAYMENT_ORDER PROCESSED',
  'CASHOUT_REVERSAL TED': 'TED sent to {to_name} canceled',
  'CASHIN_REVERSAL TED': 'TED received from {from_name} canceled',
  'CASHOUT_REVERSAL TEF': 'TEF sent to {to_name} canceled',
  'CASHIN_REVERSAL TEF': 'TEF received from {from_name} canceled',

  'DISPUTE OPEN': 'Unrecognized transaction reported',
  'DISPUTE ANALYSING': 'Transaction not recognized under review',
  'DISPUTE TEMPORARY_ISSUER_LOSS': 'Unrecognized transaction credit in trust',
  'DISPUTE CLIENT_CREDIT': 'dispute client credit',
  'DISPUTE DENIED': 'unrecognized transaction dispute denied',
  'DISPUTE ACCEPTED': 'dispute accepted',
  'DISPUTE DENIED_TEMPORARY_ISSUER_LOSS':
    'Unrecognized transaction credit on trust canceled',
  'DISPUTE CLOSED_REVERSED': 'Reversed unrecognized transaction',
  'DISPUTE CLOSED_DENIED': 'Transaction not recognized reversal denied',
  'DISPUTE CLOSED_ISSUER_LOSS': 'Non-recognized customer credit transaction',
  'DISPUTE CLOSED_APPROVED_TEMPORARY_ISSUER_LOSS':
    'Transaction not recognized credit on trust approved',

  'ADJUSTMENT_ESTORNO DE MDR CREDIT': 'Adjust Pismo tax reversal',
  'ADJUSTMENT_CREDITO EM CONFIANCA CREDIT':
    'Adjustment Pismo - credit in trust',
  'ADJUSTMENT_CREDITO EM CONFIANCA DEBIT':
    'Adjustment Pismo - credit in trust cancel',
  'ADJUSTMENT_REVERSAO DE DEBITO CREDIT': 'Adjustment Pismo - debit reversal',
  'ADJUSTMENT_CASHBACK CREDIT': 'Adjustment Pismo - cashback',
  'ADJUSTMENT_DISCOUNT CREDIT': 'Adjustment Pismo - discount',
  'ADJUSTMENT_TRANSFERENCIA CREDIT':
    'Adjustment Pismo - do not processed bank split',

  'REVERSAL_ADJUSTMENT_DISCOUNT DEBIT': 'Adjustment Pismo - discount reversal',
  'REVERSAL_ADJUSTMENT_MDR DEBIT': 'Adjust Pismo tax',
  'REVERSAL_ADJUSTMENT_REVERSAO DE CREDITO DEBIT':
    'Adjustment Pismo - credit in trust cancel',
  'REVERSAL_ADJUSTMENT_REVERSAO DE TRANSF. COF DEBIT':
    'Adjustment Pismo - credit in trust cancel',
  'REVERSAL_ADJUSTMENT_REVERSAO DE CRED. CONF. DEBIT':
    'Adjustment Pismo - credit in trust cancel',
  'REVERSAL_ADJUSTMENT_CASHBACK DEBIT': 'Adjustment Pismo - cashback reversal',
  'REVERSAL_ADJUSTMENT_TRANSFERENCIA DEBIT':
    'Adjustment Pismo - do not processed bank split canceled',

  'LEGAL BLOCK': 'legal block by judicial order',
  'LEGAL UNBLOCK': 'legal unblock by judicial order',
  'LEGAL TRANSFER': 'legal transfer by judicial order',
  'ADJUSTMENT_TRANSFERENCIA CREDIT': 'adjustment Pismo',
  'REVERSAL_ADJUSTMENT_TRANSFERENCIA CREDIT': 'adjustment Pismo',
  'ADJUSTMENT_TRANSFERENCIA DEBIT': 'adjustment Pismo',
  'REVERSAL_ADJUSTMENT_TRANSFERENCIA DEBIT': 'adjustment Pismo',

  'event-TOKENIZATION-DENIED': 'Card denied',
  'event-TOKENIZATION-APPROVED': 'Card approved',

  'event-CASHIN-PAYMENTS': 'Payments: Cash In',
  'event-CASHIN-SALES': 'Sale',
  'event-CASHOUT-COMPRA': 'Cashout - {to_name}',
  'cash-in - on demand funds load': 'Cash-in - on demand funds load',
  'ted cash out enviada para ': 'TED Cashout',
  'transferencia debito enviada para ': 'Debit transfer sent',
};

export default events;
