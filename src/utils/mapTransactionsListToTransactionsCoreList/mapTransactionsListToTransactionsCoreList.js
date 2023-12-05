import { sortByDescDate, mapTransactionsItemToTransactionsCoreItem } from '..';

const mapTransactionsListToTransactionsCoreList = (data) => {
  const { items = [] } = data;
  const itemsGrouppedByCustomer = [];
  const mappedItems = items.map(mapTransactionsItemToTransactionsCoreItem);

  sortByDescDate(mappedItems, 'event_date_utc');

  mappedItems.slice().forEach((item) => {
    const { customer = {} } = item;
    const { id: customerId } = customer;
    const group = itemsGrouppedByCustomer.find(
      (g) => g.customer.id === customerId,
    );

    if (!group) {
      itemsGrouppedByCustomer.push({
        customer,
        total: item._isInternal ? 0 : item.authorization.amount,
        transactions: [item],
      });
    } else {
      group.transactions.push(item);
      group.total += item._isInternal ? 0 : item.authorization.amount;
    }
  });

  return {
    ...data,
    items: mappedItems,
    groups: itemsGrouppedByCustomer,
  };
};

export default mapTransactionsListToTransactionsCoreList;
