'use strict';

const tokenize = require('../lib/tokenize.js').tokenize;
const Bench = require('benchmark');

new Bench.Suite('tokenize')
  .add('tokenize("first")', function() {
    tokenize('first');
  })
  .add('tokenize("first.second")', function() {
    tokenize('first.second');
  })
  .add('tokenize("first.second.third.1.name")', function() {
    tokenize('first.second.third.1.name');
  })
  .add('tokenize("comments")', function() {
    tokenize('comments');
  })
  .add('tokenize("comments.1")', function() {
    tokenize('comments.1');
  })
  .add('tokenize("comments.2.name")', function() {
    tokenize('comments.2.name');
  })
  .add('tokenize("comments.2.comments.1.comments.0.val")', function() {
    tokenize('comments.2.comments.1.comments.0.val');
  })
  .add('tokenize("comments.name")', function() {
    tokenize('comments.name');
  })
  .add('tokenize("foo[1mystring]")', function() {
    tokenize('foo[1mystring]');
  })
  .add('tokenize("foo[1mystring].bar[1]")', function() {
    tokenize('foo[1mystring].bar[1]');
  })
  .add('tokenize("foo[1mystring][2]")', function() {
    tokenize('foo[1mystring][2]');
  })
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .run();