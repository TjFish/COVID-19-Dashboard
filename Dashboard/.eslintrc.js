module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': ['error'],
    'camelcase': "off",
    'no-unused-vars':"off",
    'vars-on-top':'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
