import { parse, differenceInYears } from 'date-fns';

const getYearsOld = ({ date }) => differenceInYears(new Date(), parse(date));

export default getYearsOld;
