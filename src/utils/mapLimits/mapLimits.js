const isBankSlip = ({ rule_id }) => rule_id >= 100 && rule_id < 200;
const isNotLegacy = ({ rule_id }) => rule_id >= 100;

const mapLimits = (data) =>
  data.filter(isNotLegacy).reduce(
    (acc, entry) =>
      isBankSlip(entry)
        ? {
            ...acc,
            bankSlips: [...acc.bankSlips, entry],
          }
        : {
            ...acc,
            limits: [...acc.limits, entry],
          },

    { bankSlips: [], limits: [] },
  );

export default mapLimits;
