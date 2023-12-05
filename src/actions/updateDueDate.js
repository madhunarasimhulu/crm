import Costumer from '../clients/Customers';

const updateDueDate =
  (id, programId, costumerId, accountId, credentials) => () =>
    Costumer.updateDueDateParameter(
      id,
      programId,
      costumerId,
      accountId,
      credentials,
    );

export default updateDueDate;
