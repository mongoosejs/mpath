'use strict';

const mpath = require('../');
const Bench = require('benchmark');
const doc = require('./doc').doc;

const o = doc();
new Bench.Suite()
  .add('mpath.unset("first", obj)', function() {
    mpath.unset('first', o);
  })
  .add('mpath.unset("first.second", obj)', function() {
    mpath.unset('first.second', o);
  })
  .add('mpath.unset("first.second.third.1.name", obj)', function() {
    mpath.unset('first.second.third.1.name', o);
  })
  .add('mpath.unset("comments", obj)', function() {
    mpath.unset('comments', o);
  })
  .add('mpath.unset("comments.1", obj)', function() {
    mpath.unset('comments.1', o);
  })
  .add('mpath.unset("comments.2.name", obj)', function() {
    mpath.unset('comments.2.name', o);
  })
  .add('mpath.unset("comments.2.comments.1.comments.0.val", obj)', function() {
    mpath.unset('comments.2.comments.1.comments.0.val', o);
  })
  .add('mpath.unset("comments.name", obj)', function() {
    mpath.unset('comments.name', o);
  })
  .on('start', function() {
    console.warn('To get some reliable benchmarks, replace in unset return delete cur[part]; with return true.');
  })
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .run();

