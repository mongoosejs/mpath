'use strict';

const assert = require('assert');
const setTokenizeCache = require('../lib/tokenize.js').setTokenizeCache;
setTokenizeCache(undefined);
const tokenize = require('../lib/tokenize').tokenize;

describe('tokenize', function() {
  it('handles brackets for numbers', function() {
    assert.deepEqual(tokenize('list[0].name'), ['list', '0', 'name']);
    assert.deepEqual(tokenize('list[0][1].name'), ['list', '0', '1', 'name']);
    assert.deepEqual(tokenize('arr[11]'), ['arr', '11']);
  });

  it('handles dot notation', function() {
    assert.deepEqual(tokenize('a.b.c'), ['a', 'b', 'c']);
    assert.deepEqual(tokenize('a..b.d'), ['a', '', 'b', 'd']);
    assert.deepEqual(tokenize('arr.11'), ['arr', '11']);
  });

  it('ignores invalid numbers in square brackets', function() {
    assert.deepEqual(tokenize('foo[1mystring]'), ['foo[1mystring]']);
    assert.deepEqual(tokenize('foo[1mystring].bar[1]'), ['foo[1mystring]', 'bar', '1']);
    assert.deepEqual(tokenize('foo[1mystring][2]'), ['foo[1mystring]', '2']);
  });

  it('handles empty string', function() {
    assert.deepEqual(tokenize(''), ['']);
  });

  it('handles trailing dot', function() {
    assert.deepEqual(tokenize('a.b.'), ['a', 'b', '']);
  });
});