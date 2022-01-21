'use strict';

const mpath = require('../');
const Bench = require('benchmark');
const doc = require('./doc').doc;

const o = doc();

new Bench.Suite()
  .add('mpath.get("first", obj)', function() {
    mpath.get('first', o);
  })
  .add('mpath.get("first.second", obj)', function() {
    mpath.get('first.second', o);
  })
  .add('mpath.get("first.second.third.1.name", obj)', function() {
    mpath.get('first.second.third.1.name', o);
  })
  .add('mpath.get("comments", obj)', function() {
    mpath.get('comments', o);
  })
  .add('mpath.get("comments.1", obj)', function() {
    mpath.get('comments.1', o);
  })
  .add('mpath.get("comments.2.name", obj)', function() {
    mpath.get('comments.2.name', o);
  })
  .add('mpath.get("comments.2.comments.1.comments.0.val", obj)', function() {
    mpath.get('comments.2.comments.1.comments.0.val', o);
  })
  .add('mpath.get("comments.name", obj)', function() {
    mpath.get('comments.name', o);
  })
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .run();

