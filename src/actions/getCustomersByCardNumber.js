import { BankAccounts, CardsOnFile } from '../clients';
import { logError } from '../utils';
import {
  startCustomersByCardsFetching,
  stopCustomersByCardsFetching,
  setBankAccountSearchByIdResults,
} from '.';

const getCustomersByCardNumber = (search, credentials) => (dispatch) => {
  dispatch(startCustomersByCardsFetching());
  let arrAccByCardNumber;
  let arrDataCards;
  const lastDigits = search.substring(search.length - 4);
  return CardsOnFile.getAccountsByCardNumber(search, credentials)
    .then((data) => {
      if (data.account_ids.length > 0) {
        arrAccByCardNumber = data.account_ids;
        const arrPromisses = arrAccByCardNumber.reduce((acc, val) => {
          acc.push(CardsOnFile.getCardsOnFile(val, credentials, false, false));
          return acc;
        }, []);
        return Promise.all(arrPromisses);
      }
      return [];
    })
    .then((dataCards) => {
      arrDataCards = dataCards;
      if (arrAccByCardNumber)
        return BankAccounts.getBankAccountsByAccountId(
          credentials,
          arrAccByCardNumber.join(','),
        );
    })
    .then((dataAccounts) => {
      // Get account_id from dataAccounts, check its position in arrAccByCardNumber and save that position
      // With the postion in arrAccByCardNumber get the index from arrDataCards e execute loop for populate the data
      // with each array index always do the relation between the two arrays
      // posRelacação = arrAccByCardNumber[index] === dataAccounts[index].account_id
      // arrDataCards[posRelacação] loop and mount the data with each object and their information

      if (!arrAccByCardNumber) {
        dispatch(setBankAccountSearchByIdResults([]));
        dispatch(stopCustomersByCardsFetching());
        return;
      }

      const arrFiltered = arrAccByCardNumber.reduce((acc, val, index) => {
        const arrDataAccounts = dataAccounts.reduce((innerAcc, innerVal) => {
          if (val === innerVal.account_id) {
            const formatedAcc = innerVal.account_digit
              ? `${innerVal.account_number}-${innerVal.account_digit}`
              : innerVal.account_number;

            innerAcc.push({
              pos: index,
              name: innerVal.name || '',
              account_id: innerVal.account_id,
              account_number: formatedAcc,
            });
          }
          return innerAcc;
        }, []);
        acc.push(...arrDataAccounts);
        return acc;
      }, []);

      const resultArr = arrFiltered.reduce((acc, objData) => {
        const arrFormatedInfo = arrDataCards[objData.pos].reduce(
          (innerAcc, innerObj) => {
            lastDigits === innerObj.last_4_digits &&
              innerAcc.push({
                name: objData.name,
                account_number: objData.account_number,
                account_id: objData.account_id,
                issuer_card: innerObj.issuer_card,
                associate_date: innerObj.creation_date,
                printed_name: innerObj.printed_name,
                last_4_digits: innerObj.last_4_digits,
                card_id: innerObj.uuid,
              });
            return innerAcc;
          },
          [],
        );

        acc.push(...arrFormatedInfo);
        return acc;
      }, []);

      dispatch(setBankAccountSearchByIdResults(resultArr));
      dispatch(stopCustomersByCardsFetching());
    })
    .catch(logError);
};

export default getCustomersByCardNumber;
