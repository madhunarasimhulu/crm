const map = {
  'STATEMENT OVERDUE': 'pismofonts_fatura',
  'STATEMENT CLOSE': 'pismofonts_fatura',
  'STATEMENT CARD_BLOCK': 'pismofonts_seguranca',
  'STATEMENT PAYMENT': 'pismofonts_pagamentos_contas',
  'STATEMENT PARTIAL_PAYMENT': 'pismofonts_pagamentos_contas',
  'CREDIT LIMIT_NEAR': 'pismofonts_exclamacao',
  'CREDIT LIMIT_REACHED': 'pismofonts_exclamacao',
  'CARD CREATION': 'pismofonts_cartao',
  'CARD ACTIVATION': 'pismofonts_cartao',
  'CARD DELIVERY': 'pismofonts_cartao',
  'CARD BLOCK': 'pismofonts_seguranca',
  'CARD UNBLOCK': 'pismofonts_desbloqueio',

  // Tokpag
  'ACCOUNT ACTIVATED': 'pismofonts_exclamacao',
  'ACCOUNT BLOCKED': 'pismofonts_exclamacao',
  'PAYMENT_REQUEST_RECEIVED OPEN': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_RECEIVED SETTLED': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_RECEIVED REJECTED': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_RECEIVED CANCELLED': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_SENT OPEN': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_SENT SETTLED': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_SENT REJECTED': 'pismofonts_sms_mensagem_chat',
  'PAYMENT_REQUEST_SENT CANCELLED': 'pismofonts_sms_mensagem_chat',
  'CASHIN BANKSLIP': 'pismofonts_maiores_limites2',
  'CASHIN CREDITCARD': 'pismofonts_maiores_limites2',
  'CASHIN TED': 'pismofonts_maiores_limites2',
  'CASHIN TEF': 'pismofonts_maiores_limites2',
  'CASHOUT TED': 'pismofonts_debito',
  'CASHOUT TEF': 'pismofonts_debito',
  'TRANSFER DEBIT': 'pismofonts_debito',
  'PURCHASE DEBIT': 'pismofonts_debito',
  'TRANSFER CREDIT': 'pismofonts_maiores_limites2',
  'PURCHASE CREDIT': 'pismofonts_maiores_limites2',
};

export default function getIconClassFromTypeCategory(type, category) {
  const key = `${type} ${category}`;
  if (map[key]) return `icon-${map[key]}`;
  return 'icon-pismofonts_outline_compras';
}
