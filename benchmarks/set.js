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

const s = new Bench.Suite;

let o = doc();
s
  .add('mpath.set("first", obj, val)', function() {
    mpath.set('first', o, 1);
  })
  .add('mpath.set("first.second", obj, val)', function() {
    mpath.set('first.second', o, 1);
  })
  .add('mpath.set("first.second.third.1.name", obj, val)', function() {
    mpath.set('first.second.third.1.name', o, 1);
  })
  .add('mpath.set("comments", obj, val)', function() {
    mpath.set('comments', o, 1);
  })
  .add('mpath.set("comments.1", obj, val)', function() {
    mpath.set('comments.1', o, 1);
  })
  .add('mpath.set("comments.2.name", obj, val)', function() {
    mpath.set('comments.2.name', o, 1);
  })
  .add('mpath.set("comments.2.comments.1.comments.0.val", obj, val)', function() {
    mpath.set('comments.2.comments.1.comments.0.val', o, 1);
  })
  .add('mpath.set("comments.name", obj, val)', function() {
    mpath.set('comments.name', o, 1);
  });

s.on('start', function() {
  console.log('starting...');
})
  .on('cycle', function(e) {
    o = doc();

    const s = String(e.target);
    console.log(s);
  })
  .on('complete', function() {
    console.log('done');
  })
  .run();

