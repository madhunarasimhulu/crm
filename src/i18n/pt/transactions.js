const transactions = {
  'transactions.reported': 'Reportada',
  'transactions.noTrasaction': 'Nenhuma transação encontrada.',
  'transactions.noTrasactionForDate':
    'Nenhuma transação encontrada para a data selecionada.',
  'transactions.reportIssue': 'Informar um problema',

  'transactions.error':
    'Ocorreu um erro ao buscar transações. Por favor, tente novamente mais tarde.',

  'transaction.error':
    'Ocorreu um erro. Por favor, tente novamente mais tarde.',

  'transactions.entryMode.MANUAL': 'MANUAL',
  'transactions.entryMode.CHIP': 'CHIP',
  'transactions.entryMode.CONTACTLESS': 'SEM CONTATO',
  'transactions.entryMode.ECOMMERCE': 'ECOMMERCE',
  'transactions.entryMode.MAGNETSTRIP': 'TARJA MAGNÉTICA',
  'transactions.entryMode.OTHERS': 'OUTROS',
  'transactions.entryMode.CARDONFILE': 'CARDONFILE',

  'transactions.details.card': 'Cartão',
  'transactions.details.physical': 'Físico',

  'transactions.cancelInvoiceInstallment': 'Cancelar Refinanciamento',
  'transactions.advanceInvoiceInstallment': 'Adiantar Parcelas Refinanciamento',

  'transactions.category.HEALTH': 'Saúde',
  'transactions.category.AGRICULTURE': 'Agricultura',
  'transactions.category.SERVICES': 'Serviços',
  'transactions.category.HOME': 'Casa',
  'transactions.category.GENERAL': 'Geral',
  'transactions.category.AIRLINE': 'Linha aérea',
  'transactions.category.CAR RENTAL': 'Aluguel de carro',
  'transactions.category.HOTEL': 'Hotel',
  'transactions.category.TRANSPORT': 'Transporte',
  'transactions.category.CRUISE': 'Cruzeiro',
  'transactions.category.TRAVEL': 'Viagem',
  'transactions.category.UTILITIES': 'Utilitários',
  'transactions.category.MONEY': 'Dinheiro',
  'transactions.category.SUPPLIES': 'Suprimentos',
  'transactions.category.DRUGSTORE': 'Farmácia',
  'transactions.category.RETAIL': 'Varejo',
  'transactions.category.FUEL': 'Combustível',
  'transactions.category.AUTOMOBILE': 'Automóvel',
  'transactions.category.WHOLESALE': 'Atacado',
  'transactions.category.DUTY FREE': 'Sem taxas',
  'transactions.category.SUPERMARKET': 'Supermercado',
  'transactions.category.ELETRONICS': 'Eletrônicos',
  'transactions.category.FOOD': 'Comida',
  'transactions.category.DIGITAL': 'Digital',
  'transactions.category.JEWELRY': 'Joalheria',
  'transactions.category.DIRECT SALES': 'Vendas diretas',
  'transactions.category.RENTAL': 'Aluguel',
  'transactions.category.PARKING': 'Estacionamento',
  'transactions.category.LOTTERY': 'Loteria',
  'transactions.category.GAMBLING': 'Jogos de azar',
  'transactions.category.ENTERTAINMENT': 'Entreterimento',
  'transactions.category.SCHOOL': 'Escola',
  'transactions.category.ASSOCIATIONS': 'Associações',
  'transactions.category.FEES & FINES': 'Taxas e afins',

  // 'transactions.debit.TEF CASH IN TERCEIROS': 'TEF enviada para terceiros',
  'transactions.debit.COMPRA A VISTA': 'Compra a vista',
  'transactions.debit.COMPRA INTERNACIONAL': 'Compra internacional',
  'transactions.debit.DEBITO PAGAMENTO': 'Pagamento de fatura',
  'transactions.debit.PARCELADO SEM JUROS': 'Compra parcelada sem juros',
  'transactions.debit.PARCELA SEM JUROS': 'Parcela de compra sem juros',
  'transactions.debit.PARCELADO COM JUROS': 'Compra parcelada com juros',
  'transactions.debit.PARCELA COM JUROS': 'Parcela de compra com juros',
  'transactions.debit.SAQUE': 'Saque',
  'transactions.debit.SAQUE INTERNACIONAL': 'Saque internacional',
  'transactions.debit.PAGAMENTO': 'Pagar',
  'transactions.debit.CARGA PRE PAGO': 'Recarga via pré-pago',
  'transactions.debit.VOUCHER DE CREDITO': 'Recebimento de crédito via voucher',
  'transactions.debit.CREDITO SALARIO': 'Crédito salário',
  'transactions.debit.INCLUSAO PAGAMENTO': 'Pagar',
  'transactions.debit.ESTORNO PAGAMENTO': 'Estorno de pagamento',
  'transactions.debit.ESTORNO ENCARGOS': 'Estorno de encargos',
  'transactions.debit.ESTORNO MULTA': 'Estorno de multa',
  // 'transactions.debit.ESTORNO ANUIDADE': 'Estorno de anuidade',
  'transactions.debit.AJUSTE A CREDITO': 'Crédito via ajuste',
  'transactions.debit.AJUSTE A DEBITO': 'Débito via ajuste',
  'transactions.debit.TRANSFERENCIA DEBITO': 'Transferência de valor',
  'transactions.debit.TED CASH OUT': 'TED enviado',
  'transactions.debit.TEF CASH OUT': 'TEF enviado',
  'transactions.debit.ESTORNO TED CASH OUT': 'Estorno de TED enviado',
  'transactions.debit.ESTORNO TEF CASH OUT': 'Estorno de TEF enviado',
  'transactions.debit.TED CASH IN': 'TED recebido',
  'transactions.debit.TEF CASH IN': 'TEF recebido',
  'transactions.debit.Refund Parcial credito': 'Estorno parcial de crédito',
  'transactions.debit.TRANSFERENCIA CREDITO':
    'Transferência via cartão de crédito',
  'transactions.debit.TED CASH IN TERCEIROS': 'TED recebida de terceiros',
  'transactions.debit.TEF CASH IN TERCEIROS': 'TEF recebida de terceiros',
  'transactions.debit.DOC CASH IN': 'DOC recebido',
  'transactions.debit.TRANSFERENCIA DEBITO ZERO': 'Transferência débito zero',
  'transactions.debit.REVERSAO TRANSF. DEBITO ZERO':
    'Estorno de transferência débito zero',
  'transactions.debit.TED CASH OUT TERCEIROS': 'TED enviada para terceiros',
  'transactions.debit.TEF CASH OUT TERCEIROS': 'TEF enviada para terceiros',
  'transactions.debit.REVERSAO DE CREDITO': 'Reversão de crédito',
  'transactions.debit.REVERSAO DE DEBITO': 'Reversão de débito',
  'transactions.debit.ENCARGOS REFINANCIAMENTO': 'Encargos de refinanciamento',
  'transactions.debit.JUROS DE MORA': 'Juros de mora',
  'transactions.debit.MULTA': 'Multa',
  'transactions.debit.IOF INTERNACIONAL': 'IOF compra internacional',
  'transactions.debit.IOF': 'IOF',
  'transactions.debit.IOF SAQUE': 'IOF saque',
  'transactions.debit.ENCARGOS SAQUE': 'Encargos saque',
  'transactions.debit.DEBITO DIF CAMBIAL': 'Débito diferença cambial',
  'transactions.debit.CREDITO DIF CAMBIAL': 'Crédito diferença cambial',
  'transactions.debit.PAGAMENTO ADESAO': 'Pagamento de adesão',
  'transactions.debit.ESTORNO PAGAMENTO ADESAO':
    'Estorno de pagamento de adesão',
  'transactions.debit.CANCELAMENTO DE COMPRA': 'Cancelamento de compra',
  'transactions.debit.CANC PARCELADO SEM JUROS':
    'Cancelamento de compra parcelada sem juros',
  'transactions.debit.CANC PARCELA SEM JUROS':
    'Cancelamento de parcela de compra sem juros',
  'transactions.debit.CANC PARCELADO COM JUROS':
    'Cancelamento de compra parcelada com juros',
  'transactions.debit.CANC PARCELA COM JUROS':
    'Cancelamento de parcela de compra com juros',
  'transactions.debit.CANC COMPRA INTERNACIONAL':
    'Cancelamento de compra internacional',
  'transactions.debit.CANC IOF INTERNACIONAL':
    'Cancelamento de IOF de compra internacional',
  'transactions.debit.ESTORNO SAQUE INTERNACIONAL':
    'Estorno de saque internacional',
  'transactions.debit.ESTORNO DEBITO PAGAMENTO':
    'Estorno de pagamento via débito',
  'transactions.debit.ESTORNO SAQUE': 'Estorno de saque',
  'transactions.debit.CANC. CREDITO SALARIO': 'Cancelamento de crédito salário',
  'transactions.debit.TARIFA RECARGA PRE PAGO': 'Tarifa de recarga pré-pago',
  'transactions.debit.ANUIDADE': 'Anuidade',
  'transactions.debit.PERCENTUAL RECARGA PRE PAGO':
    'Cobrança de percentual de recarga pré-paga',
  'transactions.debit.TARIFA SAQUE': 'Tarifa de saque',
  'transactions.debit.TARIFA EMISSAO CARTAO': 'Tarifa de emissão de cartão',
  'transactions.debit.ESTORNO ANUIDADE': 'Estorno de cobrança de anuidade',
  'transactions.debit.TARIFA PRE PAGO': 'Tarifa de pré-pago',
  'transactions.debit.ESTORNO TARIFA SAQUE INTER':
    'Estorno de tarifa de saque internacional',
  'transactions.debit.DEBITO PONTUACAO': 'Débito via pontuação',
  'transactions.debit.CREDITO PONTUACAO': 'Crédito via pontuação',
  'transactions.debit.CONTRATO REFINANCIAMENTO':
    'Contratação de refinanciamento',
  'transactions.debit.TRANSFERENCIA': 'Transferência',
  'transactions.debit.CANC CREDITO PARCELAMENTO':
    'Cancelamento de crédito parcelamento',
  'transactions.debit.BLOQUEIO JUDICIAL': 'Valor bloqueado por ordem judicial',
  'transactions.debit.REVERSAO BLOQUEIO JUDICIAL':
    'Cancelamento de valor bloqueado por ordem judicial',
  'transactions.debit.PAGAMENTO NAO PROCESSADO BOLET':
    'Pagamento não processado via boleto bancário',
  'transactions.debit.CREDITO DEFINITIVO FRAUDE': 'Crédito para cliente',
  'transactions.debit.ESTORNO TAXA': 'Estorno taxa',
  'transactions.debit.CONCESSAO DESCONTO': 'Concessão de desconto',
  'transactions.debit.CONCESSAO DESCONTO - PARCEIRO':
    'Concessão de desconto - parceiro',
  'transactions.debit.CREDITO DEFINITIVO': 'Crédito para cliente',
  'transactions.debit.RECUPERACAO VALORES': 'Recuperação de valores',
  'transactions.debit.DEBITO INSPETORIA OUTRO BANCO':
    'Débito inspetoria de outro banco',
  'transactions.debit.DEBITO INSPETORIA': 'Débito inspetoria',
  'transactions.debit.TRANSFERENCIA JUDICIAL': 'Transferência judicial',
  'transactions.debit.ESTORNO PAG. NAO PROCESSADO':
    'Estorno de pagamento não processado',
  'transactions.debit.COBRANCA TAXA': 'Cobrança de taxa',
  'transactions.debit.CONTA FRIA - REC. APROPRIAR PF':
    'Recuperação de valor de conta PF, suspeita conta fria',
  'transactions.debit.CONTA FRIA - REC. APROPRIAR PJ':
    'Recuperação de valor de conta PJ, suspeita conta fria',
  'transactions.debit.PAGAMENTO BOLETO': 'Pagamento de boleto bancário',
  'transactions.debit.PAGAMENTO UTILITIES': 'Pagamento de convênios/utilidades',
  'transactions.debit.ESTORNO PAGAMENTO BOLETO':
    'Estorno de pagamento de boleto bancário',
  'transactions.debit.ESTORNO PAGAMENTO UTILITIES':
    'Estorno de pagamento de convênios/utilidades',
  'transactions.debit.ESTABELECIMENTO MODELO': 'Estabelecimento Modelo',
  'transactions.credit.payment': 'Pagamento do cartão de crédito',
  'transactions.group.general': 'Geral',
};

export default transactions;
