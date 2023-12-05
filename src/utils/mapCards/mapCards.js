const mapCards = (list, customerId) => {
  const data = {
    list,
    groups: [],
  };

  list.slice().forEach((rawCard) => {
    const { customer = {} } = rawCard;
    // const { id: customerId } = customer;
    const group = data.groups.find((g) => g.customer.id === customerId);

    const card = {
      ...rawCard,
      status: rawCard.status || rawCard.card_status,
      id: rawCard.id || rawCard.uuid,
    };

    if (!group) {
      data.groups.push({
        customer: {
          ...customer,
          printedName: card.printed_name,
          id: customerId,
        },
        cards: [card],
      });
    } else {
      group.cards.push(card);
    }
  });

  return data;
};

export default mapCards;
