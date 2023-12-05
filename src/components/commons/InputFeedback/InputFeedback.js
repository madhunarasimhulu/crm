import React from 'react';

const InputFeedback = ({ error }) =>
  error ? <div className="f7 f6-ns dark-red ph2 pt2 pb1">{error}</div> : null;

export default InputFeedback;
