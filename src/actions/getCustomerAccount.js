import { parse } from 'date-fns';
import { Accounts, Statements } from '../clients';
import { getAccountProgramsTypes, getNextStatement, setCustomer } from '.';
import { logError } from '../utils';
import getAccountProgramsTypesList from './getAccountProgramsTypesList';

let isRefresh = false;

let lastPayloadProcessed;

const getCustomerAccount =
  (customerId, accountId, credentials) => (dispatch) => {
    if (String(lastPayloadProcessed?.accountId) === String(accountId)) {
      if (isRefresh) return Promise.resolve(lastPayloadProcessed);
    }

    const promises = [
      dispatch(getAccountProgramsTypes(credentials)),

      dispatch(getAccountProgramsTypesList(credentials)),

      Accounts.getAccountDetails(accountId, credentials),

      Accounts.getAccountCustomerDetails(customerId, credentials),

      Accounts.getAccountAddresses(accountId, credentials),

      Accounts.getAccountPhones(accountId, credentials),

      Accounts.getAccountLimits(accountId, credentials),
      dispatch(getNextStatement(accountId, credentials)),
      Accounts.getAccountCustomerList(accountId, credentials),
    ];

    return Promise.allSettled(promises)

      .then(
        ([
          Accprograms,

          AccprogramsList,

          account,

          customer,

          addresses,

          phones,

          limits,
          cycleDueDate,
          customerList,
        ]) => [
          Accprograms.value || [],

          AccprogramsList.value || [],

          account.value || {},

          customer.value || {},

          addresses.value || [],

          phones.value || [],

          limits.value || {},
          cycleDueDate.value || '',
          customerList.value || {},
        ],
      )

      .then(
        ([
          Accprograms,

          AccprogramsList,

          account,

          customer,

          addresses,

          phones,

          limits,
          cycleDueDate,
          customerList,
        ]) => ({
          Accprograms: Accprograms || [],

          AccprogramsList: AccprogramsList || [],

          account,

          customer,

          limits,

          phones: phones || [],

          addresses:
            (addresses && addresses?.filter((address) => address.active)) || [],
          cycleDueDate: cycleDueDate,
          customerList: customerList,
        }),
      )

      .then((firstPayloadProcessed) => {
        const { account } = firstPayloadProcessed;

        if (account?.program_type?.toLowerCase() !== 'credito') {
          return firstPayloadProcessed;
        }

        return Statements.getStatements(accountId, credentials)

          .then((statements) => ({
            ...firstPayloadProcessed,

            statement:
              statements &&
              statements.items.length &&
              statements.items.find((item) => {
                if (item.month_index !== new Date().getMonth() + 1) {
                  return null;
                }

                return item;
              }),
          }))

          .catch(() => firstPayloadProcessed);
      })

      .then((secondPayloadProcessed) => {
        lastPayloadProcessed = mapToOldPayloadFormat(secondPayloadProcessed);

        dispatch(setCustomer(lastPayloadProcessed));

        isRefresh = true;

        return lastPayloadProcessed;
      })

      .catch(logError);
  };

const mapToOldPayloadFormat = (newPayload) => {
  if (!newPayload) return {};

  return {
    id: newPayload.account?.account_id ?? 0,
    accountId:
      newPayload.account?.account_id > 0
        ? parseInt(newPayload.account?.account_id, 10)
        : 0,
    customerId:
      newPayload.account?.customer_id > 0
        ? parseInt(newPayload.account?.customer_id, 10)
        : 0,
    brand_name: null,
    email: newPayload.account?.email ?? null,
    addresses: newPayload.addresses.map((address) => ({
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
    })),
    phones: newPayload.phones.map((phone) => ({
      id: phone?.id ?? 0,
      area_code: phone?.area_code ?? '',
      country_code: phone.country_code ?? '',
      number: phone?.number ?? '',
      type: phone?.type ?? null,
      extension: phone?.extension ?? null,
      active: phone?.active,
      last_update: null,
      creation_date: null,
    })),
    entity: {
      id: newPayload.customer?.entity?.id ?? 0,
      name: newPayload.customer?.entity?.name ?? null,
      birth_date: newPayload.customer?.entity?.birth_date ?? null,
      gender: newPayload.customer?.entity?.gender ?? null,
      document_number: newPayload.customer?.entity?.document_number ?? null,
      marital_status: newPayload.customer?.entity?.marital_status ?? null,
      is_owner: newPayload.customer?.customer?.is_owner ?? null,
    },
    card: {},
    limits: newPayload.limits,
    credit_limits: {
      available: newPayload.limits?.available_credit_limit ?? 0,
      available_monthly: newPayload.limits?.available_monthly_credit ?? 0,
      available_total_installment:
        newPayload.limits?.available_total_installment_credit ?? 0,
      available_withdrawal: newPayload.limits?.available_withdrawal_credit ?? 0,
      monthly: newPayload.limits?.monthly_credit_limit ?? 0,
      max: newPayload.limits?.max_credit_limit ?? 0,
      total: newPayload.limits?.total_credit_limit ?? 0,
      total_installment: newPayload.limits?.total_installment_credit_limit ?? 0,
      withdrawal: newPayload.limits?.withdrawal_credit_limit ?? 0,
    },
    financial: {},
    program: {
      id: newPayload.account?.program_id ?? 0,
      type: 0,
      type_name: newPayload.account?.program_type ?? null,
      name: newPayload.account?.program_name ?? null,
    },
    operation: {},
    organization: {
      id: newPayload.account?.org ?? null,
    },
    authorization: {},
    account: {
      open_due_date: newPayload.account?.open_due_date ?? null,
      account_status: newPayload.account?.status ?? null,
      collection_status: newPayload.account?.collections_status ?? null,
      status_reason_id: newPayload.account?.status_reason_id ?? null,
      status_reason_description:
        newPayload.account?.status_reason_description ?? null,
    },
    contract: {
      best_transaction_day: newPayload.cycleDueDate?.best_transaction_date
        ? parse(
            newPayload.cycleDueDate?.best_transaction_date,
            'yyyy-MM-dd',
            new Date(),
          ).getDate()
        : 0,
      amount: 0,
      credits: newPayload.statement?.total_credit ?? 0,
      current_balance: newPayload.statement?.current_balance ?? 0,
      due_date: newPayload.cycleDueDate?.due_date
        ? parse(
            newPayload.cycleDueDate?.due_date,
            'yyyy-MM-dd',
            new Date(),
          ).getDate()
        : 0,
      event_date_hour: null,
      last_statement: newPayload.statement?.cycle?.due_date ?? null,
      minimum_payment: newPayload.statement?.minimum_payment ?? 0,
    },
    Accprograms: newPayload.Accprograms,
    AccprogramsList: newPayload.AccprogramsList,
    cycleDueDate: newPayload.cycleDueDate?.due_date
      ? parse(
          newPayload.cycleDueDate?.due_date,
          'yyyy-MM-dd',
          new Date(),
        ).getDate()
      : 0,
    allCustomersList: newPayload.customerList,
  };
};

export default getCustomerAccount;
