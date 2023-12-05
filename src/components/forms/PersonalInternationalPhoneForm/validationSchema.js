const validationSchema = (fm, props, Yup) => {
  const messageRequired = fm('formValidation.required');

  return {
    type: Yup.string().required(messageRequired),
    country_code: Yup.string()
      .required(messageRequired)
      .min(2, fm('formValidation.minLength', { min: 2 })),
    area_code: Yup.string()
      .required(messageRequired)
      .min(2, fm('formValidation.minLength', { min: 2 })),
    number: Yup.string()
      .required(messageRequired)
      .min(2, fm('formValidation.minLength', { min: 2 })),
  };
};

export default validationSchema;
