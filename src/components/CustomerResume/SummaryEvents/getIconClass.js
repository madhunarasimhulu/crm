import _get from 'lodash.get';
import getIconClassFromTypeCategory from './getIconClassFromTypeCategory';
import getIconClassFromGroupName from './getIconClassFromGroupName';
import getIconClassFromPrintedName from './getIconClassFromPrintedName';
import getIconClassFromWalletName from './getIconClassFromWalletName';

export default function getIconClass(event) {
  const { type, category } = event;

  // If so, get the icon class name for TRANSACTIONs, based on "group_name"
  if (type === 'TRANSACTION') {
    if (
      category === 'AUTHORIZE' ||
      category === 'CANCELLATION' ||
      category === 'REFUSAL'
    ) {
      const groupName = _get(event, 'data.item.group_name');
      if (groupName) return getIconClassFromGroupName(groupName);
    }
  } else if (type === 'CARD') {
    if (category === 'CREATION' || category === 'PRODUCTION') {
      const printedName = _get(event, 'data.item.printed_name');
      if (printedName) return getIconClassFromPrintedName(printedName);
    }
  } else if (type === 'MDES') {
    if (category === 'ACCEPTED') {
      const walletName = _get(event, 'data.item.wallet');
      if (walletName) return getIconClassFromWalletName(walletName);
    }
  } else if (type === 'TRANSFER') {
    if (category === 'DEBIT' || category === 'CASHOUT') {
      return 'icon-pismofonts_saldo';
    }
    if (category === 'CREDIT' || category === 'CASHIN') {
      return 'icon-pismofonts_saldo';
    }
  } else if (type === 'ACCOUNT') {
    return 'icon-pismofonts_exclamacao';
  } else if (
    type === 'PAYMENT_REQUEST_SENT' ||
    type === 'PAYMENT_REQUEST_RECEIVED'
  ) {
    return 'icon-pismofonts_sms_mensagem_chat';
  }

  // Get icon class name for type/category
  return getIconClassFromTypeCategory(type, category);
}
