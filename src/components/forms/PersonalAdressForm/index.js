import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';
import { formikValidate } from '../../../utils';
import form from './PersonalAdressForm';
import validationSchema from './validationSchema';

const enhancer = withFormik({
  validate: formikValidate(validationSchema),
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => data,
});

export default injectIntl(enhancer(form));
