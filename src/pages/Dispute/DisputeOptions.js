import React from 'react';
import { DisputeList } from './DisputeList';
import { DisputeListItem } from './DisputeListItem';

export const DisputeOptions = ({ data, saveAnswer, goToNextStep }) => {
  const handleOnClick =
    ({ text, next: nextStep }) =>
    () => {
      saveAnswer({ answer: text, typeAnswer: data.type });
      goToNextStep(nextStep);
    };

  return (
    <DisputeList>
      {data.options.map((option) => (
        <DisputeListItem key={option.text} onClick={handleOnClick(option)}>
          {option.text}
        </DisputeListItem>
      ))}
    </DisputeList>
  );
};
