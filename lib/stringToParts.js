'use strict';

const numberRE = /^\d$/;

module.exports = function stringToParts(str) {
  if (str.indexOf('[') === -1) {
    if (str.indexOf('.') !== -1) {
      return String.prototype.split.call(str, '.');
    }
    return [str];
  }

  const result = [],
      len = str.length;

  let curPropertyName = '',
      i = 0,
      state = 0,
      char = '';

  for (i = 0; i < len; ++i) {
    char = str[i];

    // Fall back to treating as property name rather than bracket notation if
    // square brackets contains something other than a number.
    if (state === 1 && char !== ']' && !numberRE.test(char)) {
      state = 0;
      curPropertyName = result[result.length - 1] + '[' + curPropertyName;
      result.pop();
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