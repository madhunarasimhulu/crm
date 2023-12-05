const events = {
  'event-empty-message': 'Não existem eventos para listar.',
  'event-error-fetching-message': 'Não foi possível obter a lista de eventos.',
  'events-pay-now-cta': 'Pague agora',
  'event-STATEMENT-OVERDUE': 'Fatura em atraso.',
  'event-STATEMENT-CLOSE': 'Sua fatura foi fechada.',
  'event-STATEMENT-CARD_BLOCK': 'Cartão bloqueado por fatura em atraso.',
  'event-STATEMENT-PAYMENT': 'Pagamento recebido!',
  'event-STATEMENT-PARTIAL_PAYMENT': 'Pagamento recebido!',
  'event-CONFIRMATION-CANCELLATION': 'Confirmação de cancelamento.',
  'event-CREDIT-LIMIT_NEAR': 'Atenção ao limite!',
  'event-CREDIT-LIMIT_NEAR-description':
    'Você utilizou mais de {percent}% do seu limite.',
  'event-CREDIT-LIMIT_REACHED': 'Limite total utilizado.',
  'event-CREDIT-LIMIT_REACHED-description':
    'Você utilizou todo o seu limite de crédito.',
  'event-TRANSACTION-CANCELLATION': 'Compra cancelada.',
  'event-TRANSACTION-REFUSAL': 'Compra negada.',
  'event-CARD-CREATION': 'Cartão criado.',
  'event-CARD-ACTIVATION': 'Cartão ativado.',
  'event-CARD-DELIVERY':
    'Vimos que você recebeu seu cartão! Desbloqueie agora.',
  'event-CARD-BLOCK': 'Cartão bloqueado.',
  'event-CARD-UNBLOCK': 'Cartão desbloqueado com sucesso!',
  'event-CARD-PRODUCTION': 'Cartão produzido.',
  'event-MDES-ACCEPTED': 'Cartão aceito',
  'event-DISPUTE-CREATE': 'Compra reportada.',
  'event-DISPUTE-STATUS': 'DISPUTE STATUS',
  'event-dispute-status': 'DISPUTE STATUS',
  'event-DISPUTE ANALYSING': 'DISPUTE ANALYSING',
  'event-DISPUTE CLIENT_CREDIT': 'DISPUTE CLIENT_CREDIT',
  'event-DISPUTE-CLOSED_ISSUER_LOSS': 'DISPUTE-CLOSED_ISSUER_LOSS',
  'event-DISPUTE-TEMPORARY_ISSUER_LOSS': 'DISPUTE-TEMPORARY_ISSUER_LOSS',
  'event-PREAUTH': 'Pré-autorização.',
  'event-TRANSFER-CASHIN': 'Tranferência: Entrada de Dinheiro',
  'event-TRANSFER-CASHOUT': 'Tranferência: Saída de Dinheiro',
  'event-TRANSFER-CREDIT': 'Tranferência: Crédito',
  'event-TRANSFER-DEBIT': 'Tranferência: Débito',
  'event-TRANSFER-CREDITCARD': 'Pismo via cartão enviado para',
  'event-TRANSFER_REVERSAL-CREDITCARD': 'Pismo via cartão enviado cancelado',
  'event-TRANSFER-PAYMENT-REQUEST': 'Requisição de Transferência',
  'event-CONFIRMATION-AUTHORIZE': 'Confirmação de autorização',
  'event-PURCHASE-DEBIT': 'compra realizada',
  'event-PURCHASE_REVERSAL-DEBIT': 'compra realizada cancelada',
  'event-PURCHASE-CREDIT': 'venda realizada',
  'event-PURCHASE_REVERSAL-CREDIT': 'venda realizada cancelada',
  'event-PURCHASE-CREDITCARD': 'compra via cartão realizada',
  'event-PURCHASE_REVERSAL-CREDITCARD': 'compra via cartão realizada cancelada',
  'event-ADJUSTMENT_CANCELAMENTO DE COMPRA-CREDIT':
    'ajuste de cancelamento de uma compra via cartão de credito',
  'event-ADJUSTMENT-CREDIT': 'Ajuste a Crédito',
  'event-ADJUSTMENT-DEBIT': 'Ajuste a Débito',
  'event-DISPUTE-CLOSED_ISSUER_LOSS': 'Perda emissor',
  'event-DISPUTE-ANALYSING': 'Disputa em análise',
  'event-DISPUTE-OPEN': 'Disputa aberta',
  'event-dispute-open': 'Disputa aberta',
  'event-DISPUTE-STATUS': 'Disputa atualizada',
  'event-dispute-status': 'Disputa atualizada',
  'event-DEBIT-TRANSFER': 'Transferência de Débito',
  'event-REVERSAO DE DEBITO-CREDIT': 'Ajuste de débito/credito',
  'event-CASHOUT-PAYMENT_ORDER': 'Ordem de pagamento em dinheiro',
  'event-TRANSACTION-REFERRAL': 'Referência da transação',

  // events
  'event-ACCOUNT-ACTIVATED': 'Conta ativada',
  'event-ACCOUNT-BLOCKED': 'Conta bloqueada',
  'event-PAYMENT_REQUEST_RECEIVED-OPEN': 'cobrança em aberto',
  'event-PAYMENT_REQUEST_RECEIVED-SETTLED': 'cobrança paga',
  'event-PAYMENT_REQUEST_RECEIVED-REJECTED': 'cobrança recusada',
  'event-PAYMENT_REQUEST_RECEIVED-CANCELLED': 'cobrança cancelada',
  'event-PAYMENT_REQUEST_SENT-OPEN': 'cobrança em aberto',
  'event-PAYMENT_REQUEST_SENT-SETTLED': 'cobrança paga',
  'event-PAYMENT_REQUEST_SENT-REJECTED': 'cobrança recusada',
  'event-PAYMENT_REQUEST_SENT-CANCELLED': 'cobrança cancelada',
  'event-CASHIN-BANKSLIP': 'Depósito via boleto',
  'event-CASHIN-CREDITCARD': 'Depósito via cartão de crédito',
  'event-CASHIN-TED': 'TED recebida',
  'event-CASHIN-TEF': 'TEF recebida',
  'event-CASHOUT-TED': 'TED enviada',
  'event-CASHOUT-TEF': ' TEF enviada',
  'event-CASHOUT-TRANSFER': 'Transferência enviada',
  'event-TOKPAG-DEBIT': 'Pismo enviado para',
  'event-TOKPAG-CREDIT': 'Pismo recebido de',
  'event-BANKSLIP-OVERDUE': 'boleto vencido',
  'event-BANKSLIP-CANCELLED': 'boleto cancelado',
  'event-BANKSLIP-REGISTERED': 'boleto gerado',
  'event-BANKSLIP-SETTLED': ' boleto pago',
  'event-CASHOUT_REVERSAL-TED': 'TED enviada cancelada',
  'event-CASHOUT_REVERSAL-TEF': 'TEF enviada cancelada',
  'event-CASHIN_REVERSAL-TED': 'TED recebida cancelada',
  'event-CASHIN_REVERSAL-TEF': 'TEF recebida cancelada',
  'event-BLOQUEIO JUDICIAL-DEBIT': 'Bloqueio judicial',
  'event-CASHOUT-PAYMENTS': 'Pagar',
  'event-ESTORNO ENCARGOS REFINANCMENTO-CREDIT':
    'Estorno encargos de refinanciamento',
  'event-ESTORNO IOF-CREDIT': 'Estorno de IOF',
  'event-ESTORNO MULTA-CREDIT': 'Estorno de multa',
  'event-ESTORNO JUROS DE MORA-CREDIT': 'Estorno de juros de mora',
  'event-TRANSACTION-PARTIAL_CANCELLATION': 'Cancelamento parcial',
  'event-airport': 'Será acrescentado o valor de',
  'event-airportTaxMessage':
    'referente a taxa de embarque, cobrada na primeira parcela.',
  'ADJUSTMENT CREDIT': 'Ajuste Pismo',
  'ADJUSTMENT DEBIT': 'Ajuste Pismo',

  // New events
  'BANKSLIP REGISTERED': 'Boleto de {amount} para {to_name} gerado',
  'BANKSLIP CANCELLED': 'Boleto de {amount} para {to_name} cancelado',
  'BANKSLIP SETTLED': 'Boleto de {amount} para {to_name} pago',
  'BANKSLIP OVERDUE': 'Boleto de {amount} para {to_name} vencido',
  'BANKSLIP CASHIN': 'Carga via boleto',

  'TRANSFER DEBIT': 'Pismo enviado para {to_name}',
  'TRANSFER CREDIT': 'Pismo recebido de {from_name}',
  'TRANSFER CREDITCARD': 'Pismo via cartão enviado para {to_name}',
  'TRANSFER_REVERSAL CREDITCARD':
    'Pismo via cartão enviado para {to_name} cancelado',
  'TRANSFER CREDITCARD PISMO': 'Pismo via cartão enviado para {to_name}',

  'CASHIN BANKSLIP': 'Carga via boleto',
  'CASHIN CREDITCARD': 'Carga via cartão de crédito',
  'CASHIN TED PROCESSED': 'TED recebida de {from_name}',
  'CASHIN TED CANCELLED': 'TED recebida de {from_name}',
  'CASHIN TED REFUNDED': 'TED recebida de {from_name}',

  'CASHOUT TED PROCESSED': 'TED enviada para {to_name}',
  'CASHOUT TED CANCELLED': 'TED enviada para {to_name}',
  'CASHOUT TED REFUNDED': 'TED enviada para {to_name}',
  'CASHIN TEF PROCESSED': 'TEF recebida de {from_name}',
  'CASHIN TEF CANCELLED': 'TEF recebida de {from_name}',
  'CASHIN TEF REFUNDED': 'TEF recebida de {from_name}',
  'CASHOUT TEF PROCESSED': 'TEF enviada para {to_name}',
  'CASHOUT TEF CANCELLED': 'TEF enviada para {to_name}',
  'CASHOUT TEF REFUNDED': 'TEF enviada para {to_name}',

  'PAYMENT_REQUEST_RECEIVED OPEN':
    'cobrança de {amount} recebida de {from_name}',
  'PAYMENT_REQUEST_RECEIVED SETTLED':
    'cobrança de {amount} recebida de {from_name} paga',
  'PAYMENT_REQUEST_RECEIVED REJECTED':
    'cobrança de {amount} recebida de {from_name} recusada',
  'PAYMENT_REQUEST_RECEIVED CANCELLED':
    'cobrança de {amount} recebida de {from_name} cancelada',

  'PAYMENT_REQUEST_SENT OPEN': 'cobrança de {amount} enviada para {to_name}',
  'PAYMENT_REQUEST_SENT SETTLED':
    'cobrança de {amount} enviada para {to_name} paga',
  'PAYMENT_REQUEST_SENT REJECTED':
    'cobrança de {amount} enviada para {to_name} recusada',
  'PAYMENT_REQUEST_SENT CANCELLED':
    'cobrança de {amount} enviada para {to_name} cancelada',

  'PURCHASE DEBIT TOKPAG': 'Compra débito Pismo',
  'PURCHASE CREDIT TOKPAG': 'Compra crédito Pismo',

  'PURCHASE DEBIT': 'compra realizada em {to_name}',
  'PURCHASE CREDIT': 'venda realizada para {from_name}',
  'PURCHASE_REVERSAL CREDIT': 'compra realizada em {to_name} cancelada',
  'PURCHASE_REVERSAL DEBIT': 'venda realizada para {from_name} cancelada',
  'PURCHASE CREDITCARD': 'compra via cartão realizada em {to_name}',
  'PURCHASE_REVERSAL CREDITCARD':
    'compra via cartão realizada em {to_name} cancelada',

  'ACCOUNT ACTIVATED TOKPAG': 'Conta ativa',
  'ACCOUNT BLOCKED TOKPAG': 'Conta temporariamente bloqueada',

  'TRANSFER_REVERSAL DEBIT': 'Estorno de compra a débito',
  'TRANSACTION AUTHORIZE': 'Transação autorizada',

  'CASHOUT TED': 'TED enviada para {to_name}',
  'CASHIN TED': 'TED recebida de {from_name}',
  'CASHOUT TEF': 'TEF enviada para {to_name}',
  'CASHIN TEF': 'TEF recebida de {from_name}',
  'CASHOUT PAYMENT_ORDER PROCESSED': 'Ordem de Pagamento emitida',
  'CASHOUT_REVERSAL TED': 'TED enviada para {to_name} cancelada',
  'CASHIN_REVERSAL TED': 'TED recebida de {from_name} cancelada',
  'CASHOUT_REVERSAL TEF': 'TEF enviada para {to_name} cancelada',
  'CASHIN_REVERSAL TEF': 'TEF recebida de {from_name} cancelada',

  'DISPUTE OPEN': 'Transação não reconhecida reportada',
  'DISPUTE ANALYSING': 'Transação não reconhecida em análise',
  'DISPUTE TEMPORARY_ISSUER_LOSS':
    'Transação não reconhecida crédito em confiança',
  'DISPUTE DENIED_TEMPORARY_ISSUER_LOSS':
    'Transação não reconhecida crédito em confiança cancelado',
  'DISPUTE CLIENT_CREDIT': 'disputa crédito ao cliente',
  'DISPUTE DENIED': 'disputa de transação não reconhecida negada',
  'DISPUTE ACCEPTED': 'disputa aceita',
  'DISPUTE CLOSED_REVERSED': 'Transação não reconhecida estornada',
  'DISPUTE CLOSED_DENIED': 'Transação não reconhecida estorno negado',
  'DISPUTE CLOSED_ISSUER_LOSS':
    'Transação não reconhecida crédito para o cliente',
  'DISPUTE CLOSED_APPROVED_TEMPORARY_ISSUER_LOSS':
    'Transação não reconhecida crédito em confiança aprovado',

  'ADJUSTMENT_ESTORNO DE MDR CREDIT':
    'ajuste Pismo - estorno de taxa Pismo em duplicidade/divergente',
  'ADJUSTMENT_CREDITO EM CONFIANCA CREDIT':
    'ajuste Pismo - crédito em confiança',
  'ADJUSTMENT_CREDITO EM CONFIANCA DEBIT':
    'ajuste Pismo - cancelamento de crédito em confiança',
  'ADJUSTMENT_REVERSAO DE DEBITO CREDIT': 'ajuste Pismo - reversão de débito',
  'ADJUSTMENT_CASHBACK CREDIT': 'ajuste Pismo - cashback',
  'ADJUSTMENT_DISCOUNT CREDIT': 'ajuste Pismo - concessão de desconto (Pismo)',
  'ADJUSTMENT_TRANSFERENCIA CREDIT':
    'ajuste Pismo - pagamento não processado boleto',

  'REVERSAL_ADJUSTMENT_MDR DEBIT': 'ajuste Pismo - cobrança de taxa Pismo',
  'REVERSAL_ADJUSTMENT_CASHBACK DEBIT': 'ajuste Pismo - estorno de cashback',
  'REVERSAL_ADJUSTMENT_REVERSAO DE CREDITO DEBIT':
    'ajuste Pismo - cancelamento de crédito em confiança',
  'REVERSAL_ADJUSTMENT_REVERSAO DE TRANSF. COF DEBIT':
    'ajuste Pismo - cancelamento de crédito em confiança',
  'REVERSAL_ADJUSTMENT_REVERSAO DE CRED. CONF. DEBIT':
    'ajuste Pismo - cancelamento de crédito em confiança',
  'REVERSAL_ADJUSTMENT_DISCOUNT DEBIT': 'ajuste Pismo - estorno de desconto',
  'REVERSAL_ADJUSTMENT_TRANSFERENCIA DEBIT':
    'ajuste Pismo - reversão pagamento não processado boleto',

  'LEGAL BLOCK': 'valor bloqueado por Ordem Judicial',
  'LEGAL UNBLOCK': 'valor desbloqueado por Ordem Judicial',
  'LEGAL TRANSFER': 'valor transferido por Ordem Judicial',
  'ADJUSTMENT_TRANSFERENCIA CREDIT': 'ajuste Pismo',
  'REVERSAL_ADJUSTMENT_TRANSFERENCIA CREDIT': 'ajuste Pismo',
  'ADJUSTMENT_TRANSFERENCIA DEBIT': 'ajuste Pismo',
  'REVERSAL_ADJUSTMENT_TRANSFERENCIA DEBIT': 'ajuste Pismo',

  'event-TOKENIZATION-DENIED': 'Cartão negado',
  'event-TOKENIZATION-APPROVED': 'Cartão aceito',

  'event-CASHIN-PAYMENTS': 'Pagamentos: Entrada de Dinheiro',
  'event-CASHIN-SALES': 'Venda',
  'event-CASHOUT-COMPRA': 'Saída - {to_name}',
  'cash-in - on demand funds load': 'Cash-in - recarga em tempo real',
  'ted cash out enviada para ': 'TED Cashout',
  'transferencia debito enviada para ': 'Transferência de débito enviada',
};

export default events;
