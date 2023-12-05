import { programTypes } from '../../constants';

const isPrePaidProgramType = (programType) =>
  programType === programTypes.CHECKING_ACCOUNT ||
  programType === programTypes.PRE_PAID ||
  programType === programTypes.MERCHANT;

export default isPrePaidProgramType;
