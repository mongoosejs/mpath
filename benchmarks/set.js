'use strict';

const mpath = require('../');
const Bench = require('benchmark');
const doc = require("./doc").doc;
let o = doc();


new Bench.Suite()
  .add('mpath.set("first", obj, val)', function () {
    mpath.set('first', 1, o);
  })
  .add('mpath.set("first.second", obj, val)', function () {
    mpath.set('first.second', 1, o);
  })
  .add('mpath.set("first.second.third.1.name", obj, val)', function () {
    mpath.set('first.second.third.1.name', 1, o);
  })
  .add('mpath.set("comments", obj, val)', function () {
    mpath.set('comments', 1, o);
  })
  .add('mpath.set("comments.1", obj, val)', function () {
    mpath.set('comments.1', 1, o);
  })
  .add('mpath.set("comments.2.name", obj, val)', function () {
    mpath.set('comments.2.name', 1, o);
  })
  .add('mpath.set("comments.2.comments.1.comments.0.val", obj, val)', function () {
    mpath.set('comments.2.comments.1.comments.0.val', 1, o);
  })
  .add('mpath.set("comments.name", obj, val)', function () {
    mpath.set('comments.name', 1, o);
  })
  .on('cycle', function (e) {
    o = doc();

    const s = String(e.target);
    console.log(s);
  })
  .run();

