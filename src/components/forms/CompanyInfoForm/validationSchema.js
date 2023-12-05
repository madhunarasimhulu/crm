const validationSchema = (fm, props, Yup) => {
  const messageRequired = fm('formValidation.required');

  return {
    name: Yup.string()
      .min(3, fm('formValidation.minLength', { min: 3 }))
      .max(60, fm('formValidation.maxLength', { max: 60 }))
      .required(messageRequired),
    email: Yup.string()
      .email(fm('formValidation.emailInvalid'))
      .max(50, fm('formValidation.maxLength', { max: 50 }))
      .required(messageRequired),
    marital_status: Yup.string()
      .max(30, fm('formValidation.maxLength', { max: 30 }))
      .nullable(),
    gender: Yup.string()
      .max(1, fm('formValidation.maxLength', { max: 1 }))
      .nullable(),
  };
};

export default validationSchema;
