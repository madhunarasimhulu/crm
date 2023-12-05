import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';
import form from './PersonalPhoneForm';

const enhancer = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => data,
  handleSubmit: (data, formikBag) => {
    const { setSubmitting } = formikBag;
    const submitHandler = formikBag.props.handleSubmit;
    setSubmitting(true);

    // Remove everything except digits
    const phone = data.phone.replace(/\D/g, '');

    // Build payload object
    const payload = {
      id: 0,
      fullnumber: phone,
      area_code: phone.substr(0, 2),
      number: phone.substr(2),
      type: data.type,
      extension: data.extension || '',
    };

    submitHandler &&
      submitHandler(payload, setSubmitting).then((res) => {
        if (res) formikBag.resetForm();
      });
  },
});

export default injectIntl(enhancer(form));
