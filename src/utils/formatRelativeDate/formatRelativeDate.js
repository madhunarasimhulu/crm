import differenceInDays from 'date-fns/difference_in_days';
import differenceInHours from 'date-fns/difference_in_hours';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import differenceInSeconds from 'date-fns/difference_in_seconds';

const validateRange = (int, min, max) => int > min && (max ? int < max : true);

const formatRelativeDate = (date) => {
  const now = new Date();
  const givenDate = new Date(date);

  const diffInDays = differenceInDays(now, givenDate);

  if (validateRange(diffInDays, 0)) {
    return `${diffInDays}d`;
  }

  const diffInHours = differenceInHours(now, givenDate);

  if (validateRange(diffInHours, 0, 24)) {
    return `${diffInHours}h`;
  }

  const diffInMinutes = differenceInMinutes(now, givenDate);

  if (validateRange(diffInMinutes, 0, 60)) {
    return `${diffInMinutes}m`;
  }

  const diffInSeconds = differenceInSeconds(now, givenDate);

  if (validateRange(diffInSeconds, 0, 60)) {
    return `${diffInSeconds}s`;
  }

  return 'now';
};

export default formatRelativeDate;
