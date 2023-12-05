const validationSchema = (fm, props, Yup) => {
  const messageRequired = fm('formValidation.required');

  return {
    card_name: Yup.string()
      .min(3, fm('formValidation.minLength', { min: 3 }))
      .max(20, fm('formValidation.maxLength', { max: 20 }))
      .required(messageRequired),
    transaction_limit: Yup.number()
      .min(1, fm('formValidation.minValue', { min: 1 }))
      .required(messageRequired),
  };
};

export default validationSchema;
