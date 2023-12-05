const mapTotalDue = (data) => {
  const {
    principal_amount = 0,
    fee = 0,
    interest_amount = 0,
    overdue_interest_amount = 0,
    minimum_payment = 0,
    payment_parameters = {},
    total_balance,
  } = data;

  const { minimum_bank_slip = 0, minimum_payment: minimum_payment_slider = 0 } =
    payment_parameters;
  const min = minimum_bank_slip || minimum_payment_slider;
  const max = total_balance; // principal_amount + fee + interest_amount + overdue_interest_amount

  return {
    ...data,
    principal_amount,
    fee,
    interest_amount,
    overdue_interest_amount,
    minimum_payment,
    payment_parameters,
    consolidated: {
      min: parseFloat(min, 10),
      max,
    },
  };
};

export default mapTotalDue;
