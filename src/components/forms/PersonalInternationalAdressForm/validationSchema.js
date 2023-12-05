const validationSchema = (fm, props, Yup) => {
  const mRequired = fm('formValidation.required');

  return {
    type: Yup.string()
      .required(mRequired)
      .max(12, fm('formValidation.maxLength', { max: 12 }))
      .nullable(),
    zipcode: Yup.string()
      .min(1, fm('formValidation.minLength', { min: 1 }))
      .max(9, fm('formValidation.maxLength', { max: 9 }))
      .required(mRequired)
      .nullable(),
    address: Yup.string()
      .min(3, fm('formValidation.minLength', { min: 3 }))
      .max(80, fm('formValidation.maxLength', { max: 80 }))
      .required(mRequired)
      .nullable(),
    number: Yup.string()
      .max(11, fm('formValidation.maxLength', { max: 11 }))
      .required(mRequired)
      .nullable(),
    complementary_address: Yup.string()
      .nullable()
      .max(50, fm('formValidation.maxLength', { max: 50 }))
      .nullable(),
    neighborhood: Yup.string()
      .max(50, fm('formValidation.maxLength', { max: 50 }))
      .required(mRequired)
      .nullable(),
    city: Yup.string()
      .max(60, fm('formValidation.maxLength', { max: 60 }))
      .required(mRequired)
      .nullable(),
    state: Yup.string()
      .max(2, fm('formValidation.maxLength', { max: 2 }))
      .required(mRequired)
      .nullable(),
    country: Yup.string()
      .max(30, fm('formValidation.maxLength', { max: 30 }))
      .required(mRequired)
      .nullable(),
    mailing_address: Yup.boolean().nullable(),
  };
};

export default validationSchema;
