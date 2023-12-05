import { programTypes } from '../../constants';

const isDebitProgramType = (programType) =>
  programType === programTypes.DEBIT ||
  programType === programTypes.DEBITOZEROBALANCE;

export default isDebitProgramType;
