/**
 * Interpolates `[env]` tags in all string values of given object
 * @param {Object} data - Object to have its string values interpolated
 */
const replaceEnv = (data = {}, givenEnv) => {
  const result = {};

  for (const key in data) {
    const value = data[key];

    if (typeof value !== 'string') {
      result[key] = value;
      continue;
    }

    if (value.indexOf('[env]') === -1) {
      result[key] = value;
      continue;
    }

    const valueParts = value.split('/');
    valueParts[2] = 'api-sandbox.pismolabs.io/auth';

    result[key] = valueParts.join('/');
  }

  return result;
};

export default replaceEnv;
