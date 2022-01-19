'use strict';

const mpath = require('../');
const Bench = require('benchmark');
/**
 * test doc creator
 */

function doc() {
  return { arr: [[{ test: 41 }]] };
}

const s = new Bench.Suite;

const o = doc();
s
  .add('mpath.set("arr.test", [[42]], obj))', function() {
    mpath.set('arr.test', [[42]], o);
  });

s.on('start', function() {
  console.log('starting...');
})
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .on('complete', function() {
    console.log('done');
  })
  .run();

