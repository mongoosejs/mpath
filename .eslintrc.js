'use strict';

module.exports = {
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2015
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    'comma-style': 'error',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 2
      }
    ],
    'keyword-spacing': 'error',
    'no-whitespace-before-property': 'error',
    'no-buffer-constructor': 'warn',
    'no-console': 'off',
    'no-multi-spaces': 'error',
    'no-constant-condition': 'off',
    'func-call-spacing': 'error',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-unneeded-ternary': 'error',
    'no-const-assign': 'error',
    'no-useless-rename': 'error',
    'no-dupe-keys': 'error',
    'space-in-parens': [
      'error',
      'never'
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        block: {
          markers: [
            '!'
          ],
          balanced: true
        }
      }
    ],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true
      }
    ],
    'array-bracket-spacing': 1,
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'no-unreachable': 'error',
    quotes: [
      'error',
      'single'
    ],
    'quote-props': [
      'error',
      'as-needed'
    ],
    semi: 'error',
    'no-extra-semi': 'error',
    'semi-spacing': 'error',
    'no-spaced-func': 'error',
    'no-throw-literal': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      'never'
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'no-var': 'warn',
    'prefer-const': 'warn',
    strict: [
      'error',
      'global'
    ],
    'no-restricted-globals': [
      'error',
      {
        name: 'context',
        message: 'Don\'t use Mocha\'s global context'
      }
    ],
    'no-prototype-builtins': 'off'
  }
};
