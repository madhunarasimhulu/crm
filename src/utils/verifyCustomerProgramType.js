import { isCreditProgramType } from '.';

// verify customer program type and redirect to correct route, if necessary
export const verifyCustomerProgramType = (
  programType,
  customerProgramType,
  routeWatcher,
  customerId,
  accountId,
) => {
  const path = routeWatcher?.history?.location?.pathname || '/';
  const routeCredit = `/customers/${customerId}/accounts/${accountId}`;
  const routeDebit = `${routeCredit}/debit`;
  const creditProgram =
    isCreditProgramType(programType) ||
    isCreditProgramType(customerProgramType);

  if (
    creditProgram &&
    path !== routeCredit &&
    path.match(/\/customers\/\d*\/accounts\/\d*\/statements\/.*/) === null
  )
    routeWatcher?.history?.push(routeCredit);
  if (
    !creditProgram &&
    path !== routeDebit &&
    !path.match(/\/customers\/\d*\/accounts\/\d*\/debit\/.*/) === null
  )
    routeWatcher?.history?.push(routeDebit);
};
