const validationSchema = (fm, props, Yup) => {
  const messageRequired = fm('formValidation.required');

  return {
    reason: Yup.string().max(40).required(messageRequired),
  };
};

export default validationSchema;
