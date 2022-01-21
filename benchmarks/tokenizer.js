'use strict';

const tokenizer = require('../lib/tokenizer.js').tokenizer;
const Bench = require('benchmark');

new Bench.Suite('tokenizer')
  .add('tokenizer("first")', function() {
    tokenizer('first');
  })
  .add('tokenizer("first.second")', function() {
    tokenizer('first.second');
  })
  .add('tokenizer("first.second.third.1.name")', function() {
    tokenizer('first.second.third.1.name');
  })
  .add('tokenizer("comments")', function() {
    tokenizer('comments');
  })
  .add('tokenizer("comments.1")', function() {
    tokenizer('comments.1');
  })
  .add('tokenizer("comments.2.name")', function() {
    tokenizer('comments.2.name');
  })
  .add('tokenizer("comments.2.comments.1.comments.0.val")', function() {
    tokenizer('comments.2.comments.1.comments.0.val');
  })
  .add('tokenizer("comments.name")', function() {
    tokenizer('comments.name');
  })
  .add('tokenizer("foo[1mystring]")', function() {
    tokenizer('foo[1mystring]');
  })
  .add('tokenizer("foo[1mystring].bar[1]")', function() {
    tokenizer('foo[1mystring].bar[1]');
  })
  .add('tokenizer("foo[1mystring][2]")', function() {
    tokenizer('foo[1mystring][2]');
  })
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .run();