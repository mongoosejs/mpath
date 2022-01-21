'use strict';

const mpath = require('../');
const Bench = require('benchmark');
/**
 * test doc creator
 */

function doc() {
  return { arr: [[{ test: 41 }]] };
}
const o = doc();

new Bench.Suite()
  .add('mpath.set("arr.test", [[42]], obj))', function() {
    mpath.set('arr.test', [[42]], o);
  })
  .on('cycle', function(e) {
    const s = String(e.target);
    console.log(s);
  })
  .run();

