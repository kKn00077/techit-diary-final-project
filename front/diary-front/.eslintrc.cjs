const { rules } = require('eslint-plugin-vue')

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
        'cypress/support/**/*.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  rules: {
    'no-var': 'error', // var 사용 금지
    'no-cond-assign': ['error', 'always'], // 조건문에서 = 사용 금지
    'no-const-assign': ['error', 'always'], // const 재할당 금지
    'no-unreachable': 'error' // return, throw, break, continue 뒤에 코드가 오지 않도록

  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
