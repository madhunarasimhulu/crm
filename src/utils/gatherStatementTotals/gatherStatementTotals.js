import pick from 'lodash.pick';

const totalsPropsSchemes = {
  previous_balance: { type: 'currency', _order: 0 },
  credits: { type: 'currency', _order: 1 },
  debits: { type: 'currency', _order: 2 },
  current_balance: { type: 'currency', _order: 3 },
  // international_debits: { type: 'currency', _order: 3 },
  // exchange_rate: { type: 'number', _order: 5 },
};

const totalsPropsNames = Object.keys(totalsPropsSchemes);

const gatherStatementTotals = (statement) => {
  const totalsData = pick(statement, ...totalsPropsNames);
  const { isOpen, current_balance, minimum_payment, debits, local_balance } =
    statement;

  const totals = {
    list: [],
    international: {},
    main: {
      payment: (isOpen ? debits : current_balance) || 0,
      minimum_payment: minimum_payment || 0,
      local_balance: local_balance || 0,
    },
  };

  for (const name in totalsData) {
    const value = totalsData[name];
    const scheme = totalsPropsSchemes[name] || {};

    if (scheme.type !== 'currency' && !value) {
      continue;
    }

    totals.list.push({
      ...scheme,
      name,
      value,
    });
  }

  totals.list = totals.list.sort((a, b) => a._order > b._order);

  return totals;
};

export default gatherStatementTotals;
