import { programTypes } from '../../constants';

const isCreditProgramType = (programType) =>
  programType === programTypes.CREDIT ||
  programType === programTypes.CREDITZEROBALANCE;

export default isCreditProgramType;
