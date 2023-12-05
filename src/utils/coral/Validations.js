export const genErrors = async (schema, values, emptyErrors) => {
  let result = await schema
    .validate(values, { abortEarly: false })
    .then((result) => {
      return result;
    })
    .catch((e) => {
      return e;
    });
  let { inner: errors } = result;
  if (errors) {
    let obj = {};

    errors.forEach((error) => {
      let { path, message } = error;
      obj[path] = message;
    });

    return { status: false, errors: obj };
  }

  return { status: true, errors: emptyErrors };
};
