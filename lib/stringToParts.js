'use strict';

const numberRE = /\d/;

module.exports = function stringToParts(str) {

  if (str.indexOf('[') === -1) {
    if (str.indexOf('.') !== -1) {
      return str.split('.');
    }
    return [str];
  }

  const result = [];

  let curPropertyName = '';
  let i = 0;
  const len = str.length;
  let state = 0;

  for (i = 0; i < len; ++i) {
    const char = str[i];

    // Fall back to treating as property name rather than bracket notation if
    // square brackets contains something other than a number.
    if (state === 1 && char !== ']' && !numberRE.test(char)) {
      state = 0;
      curPropertyName = result[result.length - 1] + '[' + curPropertyName;
      result.splice(result.length - 1, 1);
    }

    if (char === '[') {
      if (state !== 2) {
        result.push(curPropertyName);
        curPropertyName = '';
      }
      state = 1;
    } else if (char === ']') {
      if (state === 1) {
        state = 2;
        result.push(curPropertyName);
        curPropertyName = '';
      } else {
        state = 0;
        curPropertyName += char;
      }
    } else if (char === '.') {
      if (state !== 2) {
        result.push(curPropertyName);
        curPropertyName = '';
      }
      state = 0;
    } else {
      curPropertyName += char;
    }
  }

  if (state !== 2) {
    result.push(curPropertyName);
  }

  return result;
};