import { composeInstallmentsLabel } from '..';

const mapTransaction = (transaction) => {
  const { authorization } = transaction;

  return {
    ...transaction,
    _isInternal: authorization.type === authorization.softDescriptor,
    authorization: {
      ...authorization,
      installmentsLabel: composeInstallmentsLabel(
        authorization.installment,
        authorization.numberOfInstallments,
      ),
    },
  };
};

export default mapTransaction;
