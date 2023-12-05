import { sortByDescDate, mapTransaction } from '..';

const mapTransactions = (data) => {
  const { items = [] } = data;
  const itemsGrouppedByCustomer = [];
  const mappedItems = items.map(mapTransaction);

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
    groups: sortByDescDate(
      itemsGrouppedByCustomer,
      'authorization.event_date_utc',
    ),
  };
};

export default mapTransactions;
