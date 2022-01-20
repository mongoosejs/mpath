'use strict';
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
exports.doc = doc;
