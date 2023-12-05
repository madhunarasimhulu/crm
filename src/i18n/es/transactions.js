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

  'transactions.debit.TEF CASH IN TERCEIROS': 'TEF enviado a terceros',
  'transactions.debit.COMPRA A VISTA': 'Comprar efectivo',
  'transactions.debit.COMPRA INTERNACIONAL': 'Compra internacional',
  'transactions.debit.DEBITO PAGAMENTO': 'Pago de la factura',
  'transactions.debit.PARCELADO SEM JUROS': 'Compra a plazos sin intereses',
  'transactions.debit.PARCELA SEM JUROS': 'Cuota de compra sin intereses',
  'transactions.debit.PARCELADO COM JUROS': 'Compra en cuotas con intereses',
  'transactions.debit.PARCELA COM JUROS': 'Cuota de compra con intereses',
  'transactions.debit.SAQUE': 'Retiro de dinero',
  'transactions.debit.SAQUE INTERNACIONAL': 'Retiro internacional',
  'transactions.debit.PAGAMENTO': 'Pagar',
  'transactions.debit.CARGA PRE PAGO': 'Recarga via pré-pago',
  'transactions.debit.VOUCHER DE CREDITO': 'Recebimento de crédito via voucher',
  'transactions.debit.CREDITO SALARIO': 'Crédito salário',
  'transactions.debit.INCLUSAO PAGAMENTO': 'Pagar',
  'transactions.debit.ESTORNO PAGAMENTO': 'Reversión de pago',
  'transactions.debit.ESTORNO ENCARGOS': 'Contracargo',
  'transactions.debit.ESTORNO MULTA': 'Inversión fina',
  'transactions.debit.ESTORNO ANUIDADE': 'Contracargo de anualidad',
  'transactions.debit.AJUSTE A CREDITO': 'Crédito via ajuste',
  'transactions.debit.AJUSTE A DEBITO': 'Ajuste de crédito',
  'transactions.debit.TRANSFERENCIA DEBITO': 'Transferencia de valor',
  'transactions.debit.TED CASH OUT': 'TED enviado',
  'transactions.debit.TEF CASH OUT': 'TEF enviado',
  'transactions.debit.ESTORNO TED CASH OUT':
    'Devolución de cargo de TED enviada',
  'transactions.debit.ESTORNO TEF CASH OUT':
    'Devolución de cargo de TEF enviada',
  'transactions.debit.TED CASH IN': 'TED recibido',
  'transactions.debit.TEF CASH IN': 'TEF recibido',
  'transactions.debit.Refund Parcial credito': 'Reversión parcial de crédito',
  'transactions.debit.TRANSFERENCIA CREDITO':
    'Transferencia de tarjeta de credito',
  'transactions.debit.TED CASH IN TERCEIROS': 'TED recibido de terceros',
  'transactions.debit.TEF CASH IN TERCEIROS': 'TEF recibido de terceros',
  'transactions.debit.DOC CASH IN': 'DOC recibido',
  'transactions.debit.TRANSFERENCIA DEBITO ZERO':
    'Transferencia de débito cero',
  'transactions.debit.REVERSAO TRANSF. DEBITO ZERO':
    'Inversión de transferencia de débito cero',
  'transactions.debit.TED CASH OUT TERCEIROS': 'TED enviado a terceros',
  'transactions.debit.TEF CASH OUT TERCEIROS': 'TEF enviado a terceros',
  'transactions.debit.REVERSAO DE CREDITO': 'Reversión de crédito',
  'transactions.debit.REVERSAO DE DEBITO': 'Reversão de deuda',
  'transactions.debit.ENCARGOS REFINANCIAMENTO': 'Cargos por refinanciamiento',
  'transactions.debit.JUROS DE MORA': 'Intereses de demora',
  'transactions.debit.MULTA': 'Bien',
  'transactions.debit.IOF INTERNACIONAL': 'Tasa de compra internacional',
  'transactions.debit.IOF': 'Tasa',
  'transactions.debit.IOF SAQUE': 'Tasa retiro de dinero',
  'transactions.debit.ENCARGOS SAQUE': 'Cargos por retiro',
  'transactions.debit.DEBITO DIF CAMBIAL': 'Deuda cambiaria',
  'transactions.debit.CREDITO DIF CAMBIAL': 'Diferencia de cambio de crédito',
  'transactions.debit.PAGAMENTO ADESAO': 'Pago de membresía',
  'transactions.debit.ESTORNO PAGAMENTO ADESAO':
    'Contracargo de pago de membresía',
  'transactions.debit.CANCELAMENTO DE COMPRA': 'Cancelación de compra',
  'transactions.debit.CANC PARCELADO SEM JUROS':
    'Cancelación de cuotas sin intereses',
  'transactions.debit.CANC PARCELA SEM JUROS':
    'Cancelación de la cuota de compra sin intereses',
  'transactions.debit.CANC PARCELADO COM JUROS':
    'Cancelación de cuotas con interés',
  'transactions.debit.CANC PARCELA COM JUROS':
    'Cancelación de la cuota de compra con intereses',
  'transactions.debit.CANC COMPRA INTERNACIONAL':
    'Cancelación de compra internacional',
  'transactions.debit.CANC IOF INTERNACIONAL':
    'Cancelación de la tarifa de compra internacional',
  'transactions.debit.ESTORNO SAQUE INTERNACIONAL':
    'Reversión internacional de retiros',
  'transactions.debit.ESTORNO DEBITO PAGAMENTO': 'Revocación de pago de débito',
  'transactions.debit.ESTORNO SAQUE': 'Retiro de inversión',
  'transactions.debit.CANC. CREDITO SALARIO':
    'Salario de cancelación de crédito',
  'transactions.debit.TARIFA RECARGA PRE PAGO': 'Tasa de recarga prepaga',
  'transactions.debit.ANUIDADE': 'Anualidad',
  'transactions.debit.PERCENTUAL RECARGA PRE PAGO':
    'Cargo porcentual de recarga prepaga',
  'transactions.debit.TARIFA SAQUE': 'Cargo por retiro',
  'transactions.debit.TARIFA EMISSAO CARTAO': 'Tarifa de emisión de tarjeta',
  'transactions.debit.ESTORNO ANUIDADE': 'Recargo de cobro de anualidades',
  'transactions.debit.TARIFA PRE PAGO': 'Tarifa prepaga',
  'transactions.debit.ESTORNO TARIFA SAQUE INTER':
    'Reversión de la tarifa de retiro internacional',
  'transactions.debit.DEBITO PONTUACAO': 'Débito por puntaje',
  'transactions.debit.CREDITO PONTUACAO': 'Crédito por puntaje',
  'transactions.debit.CONTRATO REFINANCIAMENTO':
    'Contratación de refinanciación',
  'transactions.debit.TRANSFERENCIA': 'Transferencia',
  'transactions.debit.CANC CREDITO PARCELAMENTO':
    'Cancelación de crédito a plazos',
  'transactions.debit.BLOQUEIO JUDICIAL':
    'Cantidad bloqueada por orden judicial',
  'transactions.debit.REVERSAO BLOQUEIO JUDICIAL':
    'Cancelación de la cantidad bloqueada por orden judicial',
  'transactions.debit.PAGAMENTO NAO PROCESSADO BOLET':
    'Pago no procesado mediante comprobante bancario',
  'transactions.debit.CREDITO DEFINITIVO FRAUDE': 'Crédito al cliente',
  'transactions.debit.ESTORNO TAXA': 'Cargo por devolución de cargo',
  'transactions.debit.CONCESSAO DESCONTO': 'Subsidio de descuento',
  'transactions.debit.CONCESSAO DESCONTO - PARCEIRO':
    'Concesión de descuento - socio',
  'transactions.debit.CREDITO DEFINITIVO': 'Crédito al cliente',
  'transactions.debit.RECUPERACAO VALORES': 'Recuperación de valores',
  'transactions.debit.DEBITO INSPETORIA OUTRO BANCO': 'Deuda de otro banco',
  'transactions.debit.DEBITO INSPETORIA': 'Inspección de deuda',
  'transactions.debit.TRANSFERENCIA JUDICIAL': 'Transferencia judicial',
  'transactions.debit.ESTORNO PAG. NAO PROCESSADO':
    'Reembolso de pago sin procesar',
  'transactions.debit.COBRANCA TAXA': 'Cobro de tarifas',
  'transactions.debit.CONTA FRIA - REC. APROPRIAR PF':
    'Recuperación del valor de la cuenta PF, cuenta sospechosa',
  'transactions.debit.CONTA FRIA - REC. APROPRIAR PJ':
    'Recuperación del valor de la cuenta PJ, cuenta sospechosa',
  'transactions.debit.PAGAMENTO BOLETO': 'Pago de factura bancaria',
  'transactions.debit.PAGAMENTO UTILITIES': 'Pago de convenios / utilidades',
  'transactions.debit.ESTORNO PAGAMENTO BOLETO': 'EReversión de recibo de pago',
  'transactions.debit.ESTORNO PAGAMENTO UTILITIES':
    'Reversión del pago de convenios / servicios públicos',
  'transactions.debit.ESTABELECIMENTO MODELO': 'Estabelecimento Modelo',
  'transactions.credit.payment': 'Pagamento do cartão de crédito',
  'transactions.group.general': 'Geral',
};

export default transactions;
