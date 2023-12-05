import { Accounts } from '../clients';
import { logError } from '../utils';
import { cloneDeep } from 'lodash';
import setCustomer from './setCustomer';

const getCustomerProfileInfo =
  (customerId, accountId, credentials, customer) => (dispatch) => {
    const promises = [
      Accounts.getAccountCustomerDetails(customerId, credentials),
      Accounts.getAccountAddresses(accountId, credentials),
      Accounts.getAccountPhones(accountId, credentials),
    ];

    return Promise.allSettled(promises)

      .then(([customer, addresses, phones]) => [
        customer.value || {},
        addresses.value || [],
        phones.value || [],
      ])
      .then(([customer, addresses, phones]) => ({
        customer,
        addresses:
          (addresses && addresses?.filter((address) => address.active)) || [],
        phones: phones || [],
      }))
      .then((newPayload) => {
        let newProfileInfo = cloneDeep(customer);
        newProfileInfo['email'] = newPayload?.customer?.customer?.email;
        newProfileInfo['addresses'] = newPayload.addresses.map((address) => ({
          id: address.id ?? 0,
          address: address.address ?? null,
          number: address.number ?? 0,
          complementary_address: address.complementary_address ?? null,
          neighborhood: address.neighborhood ?? null,
          zipcode: address.zip_code ?? null,
          city: address.city ?? null,
          state: address.state ?? null,
          country: address.country ?? null,
          mailing_address: address.mailing_address,
          last_update: null,
          creation_date: address.creation_date ?? null,
          type: address.address_type ?? null,
          active: address.active ?? null,
        }));
        newProfileInfo['phones'] = newPayload.phones.map((phone) => ({
          id: phone?.id ?? 0,
          area_code: phone?.area_code ?? '',
          country_code: phone.country_code ?? '',
          number: phone?.number ?? '',
          type: phone?.type ?? null,
          extension: phone?.extension ?? null,
          active: phone?.active,
          last_update: null,
          creation_date: null,
        }));
        newProfileInfo['entity'] = {
          id: newPayload.customer?.entity?.id ?? 0,
          name: newPayload.customer?.entity?.name ?? null,
          birth_date: newPayload.customer?.entity?.birth_date ?? null,
          gender: newPayload.customer?.entity?.gender ?? null,
          document_number: newPayload.customer?.entity?.document_number ?? null,
          marital_status: newPayload.customer?.entity?.marital_status ?? null,
          is_owner: newPayload.customer?.customer?.is_owner ?? null,
        };

        dispatch(setCustomer({ ...newProfileInfo }));
      })
      .catch(logError);
  };
export default getCustomerProfileInfo;
