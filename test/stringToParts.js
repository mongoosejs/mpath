'use strict';

const assert = require('assert');
const tokenizer = require('../lib/tokenizer').tokenizer;

describe('tokenizer', function() {
  it('handles brackets for numbers', function() {
    assert.deepEqual(tokenizer('list[0].name'), ['list', '0', 'name']);
    assert.deepEqual(tokenizer('list[0][1].name'), ['list', '0', '1', 'name']);
    assert.deepEqual(tokenizer('arr[11]'), ['arr', '11']);
  });

  it('handles dot notation', function() {
    assert.deepEqual(tokenizer('a.b.c'), ['a', 'b', 'c']);
    assert.deepEqual(tokenizer('a..b.d'), ['a', '', 'b', 'd']);
    assert.deepEqual(tokenizer('arr.11'), ['arr', '11']);
  });

  it('ignores invalid numbers in square brackets', function() {
    assert.deepEqual(tokenizer('foo[1mystring]'), ['foo[1mystring]']);
    assert.deepEqual(tokenizer('foo[1mystring].bar[1]'), ['foo[1mystring]', 'bar', '1']);
    assert.deepEqual(tokenizer('foo[1mystring][2]'), ['foo[1mystring]', '2']);
  });

  it('handles empty string', function() {
    assert.deepEqual(tokenizer(''), ['']);
  });

  it('handles trailing dot', function() {
    assert.deepEqual(tokenizer('a.b.'), ['a', 'b', '']);
  });
});