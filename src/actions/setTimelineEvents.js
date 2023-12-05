const type = 'SET_TIMELINE_EVENTS';

const setTimelineEvents = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTimelineEvents;
