'use strict';

const stringToParts = require('../lib/stringToParts.js');
const Bench = require('benchmark');

const s = new Bench.Suite("stringToParts")
  .add('stringToParts("first")', function () {
    stringToParts('first');
  })
  .add('stringToParts("first.second")', function () {
    stringToParts('first.second');
  })
  .add('stringToParts("first.second.third.1.name")', function () {
    stringToParts('first.second.third.1.name');
  })
  .add('stringToParts("comments")', function () {
    stringToParts('comments');
  })
  .add('stringToParts("comments.1")', function () {
    stringToParts('comments.1');
  })
  .add('stringToParts("comments.2.name")', function () {
    stringToParts('comments.2.name');
  })
  .add('stringToParts("comments.2.comments.1.comments.0.val")', function () {
    stringToParts('comments.2.comments.1.comments.0.val');
  })
  .add('stringToParts("comments.name")', function () {
    stringToParts('comments.name');
  });

s.on('start', function () {
  console.log('starting...');
})
  .on('cycle', function (e) {
    const s = String(e.target);
    console.log(s);
  })
  .on('complete', function () {
  })
  .run();