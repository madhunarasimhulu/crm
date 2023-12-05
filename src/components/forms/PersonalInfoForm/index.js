import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';
import { formikValidate } from '../../../utils';
import form from './PersonalInfoForm';
import validationSchema from './validationSchema';

const enhancer = withFormik({
  validate: formikValidate(validationSchema),
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => data,
  handleSubmit: (payload, formikBag) => {
    const { setSubmitting } = formikBag;
    const { onSubmit } = formikBag.props;
    setSubmitting(true);
    onSubmit(payload, setSubmitting);
  },
});

export default injectIntl(enhancer(form));
