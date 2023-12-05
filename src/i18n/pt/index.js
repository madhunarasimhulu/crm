import general from './general';
import formValidation from './formValidation';
import cards from './cards';
import profileParameters from './profileParameters';
import formLabels from './formLabels';
import attendanceNotes from './attendanceNotes';
import userMenu from './userMenu';
import callDetails from './callDetails';
import transactions from './transactions';
import paymentModal from './paymentModal';
import totals from './totals';
import months from './months';
import customerSearch from './customerSearch';
import disputes from './disputes';
import creditResume from './credit-resume';
import events from './events';
import warningDueStatement from './warningDueStatement';
import rechargeModal from './rechargeModal';
import advanceInvoiceInstallment from './advanceInvoiceInstallment';
import cancelInvoiceInstallment from './cancelInvoiceInstallment';
import bankAccounts from './bankAccounts';
import timeline from './timeline';
import pid from './pid';
import feedbackModals from './feedbackModals';
import programs from './programs';
import transferModal from './transferModal';
import spendingLimits from './spendingLimits';

const pt = {
  ...formValidation,
  ...cards,
  ...general,
  ...profileParameters,
  ...formLabels,
  ...attendanceNotes,
  ...userMenu,
  ...callDetails,
  ...transactions,
  ...paymentModal,
  ...totals,
  ...months,
  ...customerSearch,
  ...disputes,
  ...creditResume,
  ...events,
  ...warningDueStatement,
  ...rechargeModal,
  ...advanceInvoiceInstallment,
  ...cancelInvoiceInstallment,
  ...bankAccounts,
  ...timeline,
  ...pid,
  ...feedbackModals,
  ...programs,
  ...transferModal,
  ...spendingLimits,
};

export default pt;
