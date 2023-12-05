import { monthList } from '../../constants';
import { compensateDate } from '..';

const flattenStatements = (data = []) => {
  const result = [];

  data.forEach((year, _yearIndex) => {
    const { year_due_date, months } = year;

    const now = new Date();
    // const currentDate = now.getUTCDate()
    const currentYear = now.getUTCFullYear();
    const currentMonthIndex = now.getUTCMonth();
    const currentMonthName = monthList[currentMonthIndex];
    const currentMonthAcronym = currentMonthName.substr(0, 3);
    const isCurrentYear = currentYear === year_due_date;
    const isFutureYear = !isCurrentYear && currentYear <= year_due_date;

    months.forEach((month) => {
      result.push({
        ...month,
        index: result.length,
        _yearIndex,
        _monthIndex: monthList.findIndex(
          (monthName) => monthName.substr(0, 3) === month.name.toLowerCase(),
        ),
        year_due_date,
        isCurrentYear,
        isFutureYear,
        isOpen:
          compensateDate(month.cicle_closing_date).getTime() > now.getTime(),
        fullDueDate: month.due_date,
        due_date: month.due_date
          ? parseInt(month.due_date.split('-')[2], 10)
          : null,
        shortYear: parseInt(`${year_due_date}`.slice(-2), 10),
        fullName: monthList.find(
          (monthName) => monthName.substr(0, 3) === month.name.toLowerCase(),
        ),
        name: month.name.toLowerCase(),
        isUpcoming: isCurrentYear
          ? month.name.toLowerCase() === currentMonthAcronym
            ? // parseInt(month.due_date.split('-')[2], 10) > currentDate
              false
            : currentMonthIndex <
              monthList.findIndex(
                (m) => m.substr(0, 3) === month.name.toLowerCase(),
              )
          : currentYear < year_due_date,
      });
    });
  });

  return result;
};

export default flattenStatements;
