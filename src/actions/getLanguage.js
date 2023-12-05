import { getBrowserLanguage } from '../utils';
import setLanguage from './setLanguage';

const getLanguage = () => (dispatch) =>
  dispatch(
    setLanguage(
      window.localStorage.getItem('ui.language') ||
        getBrowserLanguage() ||
        'en',
    ),
  );

export default getLanguage;
