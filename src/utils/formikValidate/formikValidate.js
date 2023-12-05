import * as Yup from 'yup';

export default function formikValidate(schemaBuilder) {
  const schemaCache = {};

  return (values, props) => {
    const { locale } = props.intl;
    // Build the function that formats messages
    const fm = (id, values) => props.intl.formatMessage({ id }, values);

    // Search the cache or build a schema for this language
    if (!schemaCache[locale]) {
      schemaCache[locale] = schemaBuilder(fm, props, Yup);
    }
    const schema = schemaCache[locale];

    return Yup.object()
      .shape(schema)
      .validate(values, { abortEarly: false })
      .catch((err) => {
        // It loops through the errors of each field and mounts the object with errors to the formik
        const errors = {};
        err.inner.forEach((error) => {
          const { path, message } = error;
          if (!errors[path]) {
            errors[path] = message;
          }
        });
        throw errors;
      });
  };
}
