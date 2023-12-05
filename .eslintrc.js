module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['react-app', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error',
    {
      'endOfLine': 'auto',
    }],
    'object-curly-spacing': ['error', 'always'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-dupe-keys': 'off',
  },
};
