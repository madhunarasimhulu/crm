import { PasswordPolicy, charsets } from 'password-sheriff';

const policy = new PasswordPolicy({
  length: {
    minLength: 8,
  },
  contains: {
    expressions: [
      charsets.upperCase,
      charsets.lowerCase,
      charsets.numbers,
      charsets.specialCharacters,
    ],
  },
});

export default policy;
