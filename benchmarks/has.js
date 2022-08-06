'use strict';

const mpath = require('../');
const Bench = require('benchmark');
const doc = require('./doc').doc;

const o = doc();

new Bench.Suite()
  .add('mpath.has("first", obj)', function() {
    mpath.has('first', o);
  })
  .add('mpath.has("first.second", obj)', function() {
    mpath.has('first.second', o);
  })
  .add('mpath.has("first.second.third.1.name", obj)', function() {
    mpath.has('first.second.third.1.name', o);
  })
  .add('mpath.has("comments", obj)', function() {
    mpath.has('comments', o);
  })
  .add('mpath.has("comments.1", obj)', function() {
    mpath.has('comments.1', o);
  })
  .add('mpath.has("comments.2.name", obj)', function() {
    mpath.has('comments.2.name', o);
  })
  .add('mpath.has("comments.2.comments.1.comments.0.val", obj)', function() {
    mpath.has('comments.2.comments.1.comments.0.val', o);
  })
  .add('mpath.has("comments.name", obj)', function() {
    mpath.has('comments.name', o);
  })
  .add('mpath.has("foo[1mystring]", obj)', function() {
    mpath.has('foo[1mystring]', o);
  })
  .add('mpath.has("foo[1mystring].bar[1]", obj)', function() {
    mpath.has('foo[1mystring].bar[1]', o);
  })
  .add('mpath.has("foo[1mystring][2]", obj)', function() {
    mpath.has('foo[1mystring][2]', o);
  })
  .add('mpath.has(["comments", "2", "comments","1","comments","0","val"], obj)', function() {
    mpath.has(['comments', '2', 'comments', '1', 'comments', '0', 'val'], o);
  })
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .run();

