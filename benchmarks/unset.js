'use strict';

const mpath = require('../');
const Bench = require('benchmark');
/**
 * test doc creator
 */

function doc() {
  return {
    first: { second: { third: [3, { name: 'aaron' }, 9] } },
    comments: [
      { name: 'one' },
      { name: 'two', _doc: { name: '2' } },
      {
        name: 'three',
        comments: [{}, { comments: [{ val: 'twoo' }] }],
        _doc: { name: '3', comments: [{}, { _doc: { comments: [{ val: 2 }] } }] }
      }
    ],
    name: 'jiro',
    array: [
      { o: { array: [{ x: { b: [4, 6, 8] } }, { y: 10 }] } },
      { o: { array: [{ x: { b: [1, 2, 3] } }, { x: { z: 10 } }, { x: { b: 'hi' } }] } },
      { o: { array: [{ x: { b: null } }, { x: { b: [null, 1] } }] } },
      { o: { array: [{ x: null }] } },
      { o: { array: [{ y: 3 }] } },
      { o: { array: [3, 0, null] } },
      { o: { name: 'ha' } }
    ],
    arr: [
      { arr: [{ a: { b: 47 } }, { a: { c: 48 } }, { d: 'yep' }] },
      { yep: true }
    ]
  };
}

const o = doc();
const s = new Bench.Suite()
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
  });

s.on('start', function() {
  console.warn('To get some reliable benchmarks, replace in unset return delete cur[part]; with return true.');
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

