import { composeInstallmentsLabel } from '..';

const mapTransactionsItemToTransactionsCoreItem = (transaction) => {
  const mappedTransaction = {
    event_date_utc: transaction.event_date,
    transaction: {
      id: transaction.id,
      category: transaction.user_category,
    },
    id: transaction.id,
    customer: {
      id: transaction.customer_id,
    },
    merchant: transaction.merchant,
    _isInternal: transaction.authorization.type === transaction.softDescriptor,
    authorization: {
      id: transaction.authorization.id,
      is_credit: transaction.transaction_type.credit,
      soft_descriptor: transaction.soft_descriptor,
      softDescriptor: transaction.soft_descriptor,
      description: transaction.transaction_type?.description,
      amount: transaction.amount?.find((a) => a.type === 'PRINCIPAL')?.value,
      localAmount: transaction.amount?.find((a) => a.type === 'LOCAL')?.value,
      local_amount: transaction.amount?.find((a) => a.type === 'LOCAL')?.value,
      referenceAmount: transaction.amount?.find((a) => a.type === 'SETTLEMENT')
        ?.value,
      reference_amount: transaction.amount?.find((a) => a.type === 'SETTLEMENT')
        ?.value,
      localCurrency: transaction.amount?.find((a) => a.type === 'LOCAL')
        ?.currency,
      local_currency: transaction.amount?.find((a) => a.type === 'LOCAL')
        ?.currency,
      installment: transaction.installment,
      numberOfInstallments:
        transaction.number_of_installments ||
        transaction.number_of_Installments,
      type: transaction.transaction_type.description,
      event_date: transaction.event_date,
      event_date_utc: transaction.event_date,
      card_name: transaction?.card?.name,
      installmentsLabel: composeInstallmentsLabel(
        transaction.installment,
        transaction.number_of_installments ||
          transaction.number_of_Installments,
      ),
    },
  };

  return mappedTransaction;
};

export default mapTransactionsItemToTransactionsCoreItem;
