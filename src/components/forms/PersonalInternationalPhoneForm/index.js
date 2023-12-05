import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';
import { formikValidate } from 'utils';
import form from './PersonalInternationalPhoneForm';
import validationSchema from './validationSchema';

const enhancer = withFormik({
  validate: formikValidate(validationSchema),
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => data,
  handleSubmit: (payload, formikBag) => {
    const { setSubmitting } = formikBag;
    const submitHandler = formikBag.props.handleSubmit;
    setSubmitting(true);

    const promise = submitHandler && submitHandler(payload, setSubmitting);
    if (promise) {
      promise.then((res) => {
        if (res) formikBag.resetForm();
      });
    } else {
      formikBag.resetForm();
    }
  },
});

export default injectIntl(enhancer(form));
