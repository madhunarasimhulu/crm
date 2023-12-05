const compensateDate = (givenDate) => {
  const date = new Date(givenDate);
  const properDate = new Date(
    date.valueOf() + date.getTimezoneOffset() * 60000,
  );

  return properDate;
};

export default compensateDate;
