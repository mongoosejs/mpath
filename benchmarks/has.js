'use strict';

const mpath = require('../');
const Bench = require('benchmark');
/**
 * test doc creator
 */

function doc() {
  const o = { first: { second: { third: [3, { name: 'aaron' }, 9] } } };
  o.comments = [
    { name: 'one' },
    { name: 'two', _doc: { name: '2' } },
    {
      name: 'three',
      comments: [{}, { comments: [{ val: 'twoo' }] }],
      _doc: { name: '3', comments: [{}, { _doc: { comments: [{ val: 2 }] } }] }
    }
  ];
  o.name = 'jiro';
  o.array = [
    { o: { array: [{ x: { b: [4, 6, 8] } }, { y: 10 }] } },
    { o: { array: [{ x: { b: [1, 2, 3] } }, { x: { z: 10 } }, { x: { b: 'hi' } }] } },
    { o: { array: [{ x: { b: null } }, { x: { b: [null, 1] } }] } },
    { o: { array: [{ x: null }] } },
    { o: { array: [{ y: 3 }] } },
    { o: { array: [3, 0, null] } },
    { o: { name: 'ha' } }
  ];
  o.arr = [
    { arr: [{ a: { b: 47 } }, { a: { c: 48 } }, { d: 'yep' }] },
    { yep: true }
  ];
  return o;
}

const o = doc();

const s = new Bench.Suite()
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

