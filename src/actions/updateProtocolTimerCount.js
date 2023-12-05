const type = 'UPDATE_PROTOCOL_TIMER_COUNTER';

const updateProtocolTimerCounter = (payload) => ({
  type,
  payload,
});

export { type };
export default updateProtocolTimerCounter;
