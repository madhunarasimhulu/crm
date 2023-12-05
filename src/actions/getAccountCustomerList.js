import { Accounts, Customers } from '../clients';
import {
  setAccountCustomerList,
  getCards,
  isWalletLoadingCompleted,
  resetCards,
} from '.';

const getAccountCustomerList =
  (accountId, credentials, user, customer) => async (dispatch) => {
    try {
      await dispatch(resetCards());
      dispatch(isWalletLoadingCompleted(true));
      // if (user?.isCustomer) {
      if (user?.isCustomer) {
        const res = await Accounts.getAccountCustomerList(
          accountId,
          credentials,
        );
        if (res?.items.length === 1) {
          dispatch(
            getCards(
              customer?.customerId,
              accountId,
              credentials,
              user?.isCustomer,
            ),
          );
        } else {
          const result = res?.items.filter(
            (e) =>
              e?.customer?.id == customer?.customerId &&
              e?.customer?.is_owner === true,
          );
          if (result.length > 0) {
            await Promise.all(
              res?.items.map(async (obj) => {
                await dispatch(
                  getCards(
                    obj?.customer?.id,
                    accountId,
                    credentials,
                    user?.isCustomer,
                  ),
                );
              }),
            );
          } else {
            dispatch(
              getCards(
                customer?.customerId,
                accountId,
                credentials,
                user?.isCustomer,
              ),
            );
          }
        }
        if (res.error) return;
        dispatch(setAccountCustomerList(res.items));
      } else {
        dispatch(
          getCards(
            customer?.customerId,
            accountId,
            credentials,
            user?.isCustomer,
          ),
        );
      }
    } catch (err) {
      return err;
    } finally {
      dispatch(isWalletLoadingCompleted(false));
    }
  };

export default getAccountCustomerList;
