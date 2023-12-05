const type = 'SET_AGREEMENT_SENDING_SMS_OR_EMAIL';

const setAgreementSendingSmsOrEmail = (data = true) => ({
  type,
  data,
});

export { type };
export default setAgreementSendingSmsOrEmail;
