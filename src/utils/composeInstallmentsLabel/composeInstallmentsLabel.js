const composeInstallmentsLabel = (installment, installments) => {
  if (!installment || !installments) {
    return null;
  }

  if (installments <= 1) {
    return null;
  }

  return `${installment}/${installments}`;
};

export default composeInstallmentsLabel;
