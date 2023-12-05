import uniq from 'lodash.uniq';

export default function validateReactIntlDictKeys(dictsArr) {
  // Get length from dictionaries
  const arrLen = dictsArr.map((dict) => Object.keys(dict).length);

  // Concat the dictionaries...
  let uniqArr = [];
  dictsArr.forEach((dict) => {
    uniqArr = uniqArr.concat(Object.keys(dict));
  });

  // ... and generate a unique array of values ​​and add to the length array
  const uniqArrLen = uniq(uniqArr).length;

  arrLen.push(uniqArrLen);

  // If any value in the array is different, there is some disparity
  arrLen.reduce((acc, current) => {
    if (acc === 0) return current;
    if (current !== acc) {
    }
    return acc;
  }, 0);

  return true;
}
