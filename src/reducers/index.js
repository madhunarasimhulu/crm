import { combineReducers } from 'redux';

import { default as user } from './user';
import { default as call } from './call';
import { default as credentials } from './credentials';
import { default as customers } from './customers';
import { default as customer } from './customer';
import { default as programSelector } from './programSelector';
import { default as statements } from './statements';
import { default as transaction } from './transaction';
import { default as dispute } from './dispute';
import { default as payment } from './payment';
import { default as ui } from './ui';
import { default as profileParams } from './profileParams';
import { default as cards } from './cards';
import { default as newCard } from './newCard';
import { default as card } from './card';
import { default as cardUnblock } from './cardUnblock';
import { default as cardTemporaryBlock } from './cardTemporaryBlock';
import { default as cardStatusChange } from './cardStatusChange';
import { default as toast } from './toast';
import { default as BlockedModal } from './BlockedModal';
import { default as limitProposal } from './limitProposal';
import { default as attendanceNotes } from './attendanceNotes';
import { default as callHistory } from './callHistory';
import { default as callDetails } from './callDetails';
import { default as cardEditParam } from './cardEditParam';
import { default as modal } from './modal';
import { default as timeline } from './timeline';
import { default as routeWatcher } from './routeWatcher';
import { default as customerAddressesHistory } from './customerAddressesHistory';
import { default as customerPhonesHistory } from './customerPhonesHistory';
import { default as splitInvoice } from './splitInvoice';
import { default as recharge } from './recharge';
import { default as advanceInvoiceInstallment } from './advanceInvoiceInstallment';
import { default as cancelInvoiceInstallment } from './cancelInvoiceInstallment';
import { default as bankAccounts } from './bankAccounts';
import { default as rules } from './rules';
import { default as searchByCard } from './searchByCard';
import { pid } from './pid';
import { default as org } from './org';
import { default as cardPasswordChange } from './cardPasswordChange';
import { default as internationalOtp } from './internationalOtp';
import { default as spendingLimits } from './spendingLimits';
import { default as onBoard } from './onBoard';
import { default as isAccountBlockedModalOpen } from './accountBlockedModal';
import serviceRequest from './serviceRequests';
import customerSearch from './coral/CustomerSearch';
import { default as AccProgramTypes } from './accountProgramTypes';
import initialState from '../store/initialState';

const mustKeepEvenAfterLogout = ['ui'];
const mustKeepAfterProtocolClose = ['ui', 'user', 'credentials'];

function deriveObjectWithKeys(obj, keys) {
  const newObj = {};

  keys.forEach((propertyName) => {
    newObj[propertyName] = { ...obj[propertyName] };
  });

  return newObj;
}

const root = (state = {}, action) => {
  if (action) {
    /*
    Ao fechar o protocolo os eventos da timeline da account anterior eram
    renderizados temporariamente ate que todos requests fossem resolvidos.
    Por este motivo as demais keys da store sao resetadas.
    */
    if (action.type === 'CLOSE_CUSTOMER_PROTOCOL') {
      const persistedState = deriveObjectWithKeys(
        state,
        mustKeepAfterProtocolClose,
      );
      return {
        ...initialState,
        ...persistedState,
      };
    }
  }

  return state;
};

const appReducer = combineReducers({
  root,
  user,
  call,
  credentials,
  customers,
  customer,
  programSelector,
  statements,
  transaction,
  dispute,
  payment,
  ui,
  profileParams,
  cards,
  newCard,
  card,
  cardUnblock,
  cardTemporaryBlock,
  cardStatusChange,
  toast,
  limitProposal,
  attendanceNotes,
  callHistory,
  callDetails,
  cardEditParam,
  modal,
  timeline,
  routeWatcher,
  customerAddressesHistory,
  customerPhonesHistory,
  splitInvoice,
  recharge,
  advanceInvoiceInstallment,
  cancelInvoiceInstallment,
  bankAccounts,
  rules,
  searchByCard,
  pid,
  org,
  cardPasswordChange,
  spendingLimits,
  onBoard,
  internationalOtp,
  isAccountBlockedModalOpen,
  serviceRequest,
  AccProgramTypes,
  customerSearch,
  BlockedModal,
});

const rootReducer = (state, action) => {
  if (action.type === 'MANUAL_LOGOUT') {
    const persistedState = deriveObjectWithKeys(state, mustKeepEvenAfterLogout);
    state = {
      ...initialState,
      ...persistedState,
    };
  }

  return appReducer(state, action);
};

export default rootReducer;
