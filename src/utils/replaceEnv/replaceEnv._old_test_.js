import { describe, expect, it } from 'react-testing-library';
import replaceEnv from './replaceEnv';

describe('Utils # replaceEnv', () => {
  it('should interpolate the [env] tag in all string values of given object', () => {
    const scenario = {
      key: '[env].value',
      anotherKey: 2,
      booleanThisTime: true,
      hello: 'world [env]!',
      notthisone: 'hehehe',
    };

    const expected = {
      ...scenario,
      key: 'qa.value',
      hello: 'world qa!',
    };

    expect(replaceEnv(scenario)).toEqual(expected);
  });

  it('should interpolate pismo baseURL in all string values that represent URLs of given object', () => {
    const scenario = {
      url: '//api-auth[env].elasticbeanstalk.com/v1/tokens',
    };

    expect(replaceEnv(scenario, 'pismo')).toEqual({
      url: '//api-gateway-pismo.pismo.io/auth/v1/tokens',
    });
    expect(replaceEnv(scenario, 'pismoqa')).toEqual({
      url: '//api-sandbox.pismolabs.io/auth/v1/tokens',
    });
  });
});
