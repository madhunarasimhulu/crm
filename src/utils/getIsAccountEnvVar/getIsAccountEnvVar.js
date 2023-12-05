/**
 * Retrieve if access come from "Conta" or "Atendimento"
 */
const getIsAccountEnvVar = () =>
  process.env.REACT_APP_IS_ACCOUNT &&
  process.env.REACT_APP_IS_ACCOUNT === 'true';

export default getIsAccountEnvVar;
