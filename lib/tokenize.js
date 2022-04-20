'use strict';

const split = String.prototype.split;
const numbers = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

const DEFAULT = 0;
const IN_SQUARE_BRACKETS = 1;
const IMMEDIATELY_AFTER_SQUARE_BRACKETS = 2;

exports.tokenize = function tokenize(str) {
  if (str.indexOf('[') === -1) {
    if (str.indexOf('.') !== -1) {
      return split.call(str, '.');
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
    if (state === IN_SQUARE_BRACKETS && char !== ']' && !numbers.has(char)) {
      state = DEFAULT;
      curPropertyName = result[result.length - 1] + '[' + curPropertyName;
      result.pop();
    }

    if (char === '[') {
      if (state !== IMMEDIATELY_AFTER_SQUARE_BRACKETS) {
        result.push(curPropertyName);
        curPropertyName = '';
      }
      state = IN_SQUARE_BRACKETS;
    } else if (char === ']') {
      if (state === IN_SQUARE_BRACKETS) {
        state = IMMEDIATELY_AFTER_SQUARE_BRACKETS;
        result.push(curPropertyName);
        curPropertyName = '';
      } else {
        state = DEFAULT;
        curPropertyName += char;
      }
    } else if (char === '.') {
      if (state !== IMMEDIATELY_AFTER_SQUARE_BRACKETS) {
        result.push(curPropertyName);
        curPropertyName = '';
      }
      state = DEFAULT;
    } else {
      curPropertyName += char;
    }
  }

  if (state !== IMMEDIATELY_AFTER_SQUARE_BRACKETS) {
    result.push(curPropertyName);
  }

  return result;
}
