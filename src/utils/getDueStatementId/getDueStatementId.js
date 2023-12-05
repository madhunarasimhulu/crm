import formatDate from 'date-fns/format';

const getDueStatementId = (openDueDate, statements) => {
  if (!openDueDate) {
    return;
  }

  let result;

  statements.months.forEach((month) => {
    const formattedFullDueDate = formatDate(month.fullDueDate, 'YYYY-MM-DD');
    const formattedOpenDueDate = formatDate(openDueDate, 'YYYY-MM-DD');

    if (formattedFullDueDate === formattedOpenDueDate) {
      result = month.statement.id;
    }
  });

  return result;
};

export default getDueStatementId;
