
var mpath = require('../')
var assert = require('assert')

describe('mpath', function(){

  var o = { first: { second: { third: [3,{ name: 'aaron' }, 9] }}};
  o.comments = [
      { name: 'one' }
    , { name: 'two', _doc: { name: '2' }}
    , { name: 'three'
        , comments: [{},{ comments: [{val: 'twoo'}]}]
        , _doc: { name: '3', comments: [{},{ _doc: { comments: [{ val: 2 }] }}]  }}
  ];
  o.name = 'jiro';
  o.array = [
      { o: { array: [{x: {b: [4,6,8]}}, { y: 10} ] }}
    , { o: { array: [{x: {b: [1,2,3]}}, { x: {z: 10 }}, { x: {b: 'hi'}}] }}
    , { o: { array: [{x: {b: null }}, { x: { b: [null, 1]}}] }}
    , { o: { array: [{x: null }] }}
    , { o: { array: [{y: 3 }] }}
    , { o: { array: [3, 0, null] }}
    , { o: { name: 'ha' }}
  ];
  o.arr = [
      { arr: [{ a: { b: 47 }}, { a: { c: 48 }}, { d: 'yep' }] }
    , { yep: true }
  ]

  describe('get', function(){

    it('`path` must be a string or array', function(done){
      assert.throws(function () {
        mpath.get({}, o);
      }, /Must be either string or array/);
      assert.throws(function () {
        mpath.get(4, o);
      }, /Must be either string or array/);
      assert.throws(function () {
        mpath.get(function(){}, o);
      }, /Must be either string or array/);
      assert.throws(function () {
        mpath.get(/asdf/, o);
      }, /Must be either string or array/);
      assert.throws(function () {
        mpath.get(Math, o);
      }, /Must be either string or array/);
      assert.throws(function () {
        mpath.get(Buffer, o);
      }, /Must be either string or array/);
      assert.doesNotThrow(function () {
        mpath.get('string', o);
      });
      assert.doesNotThrow(function () {
        mpath.get([], o);
      });
      done();
    })

    describe('without `special`', function(){
      it('works', function(done){
        assert.equal('jiro', mpath.get('name', o));

        assert.deepEqual(
          { second: { third: [3,{ name: 'aaron' }, 9] }}
          , mpath.get('first', o)
        );

        assert.deepEqual(
          { third: [3,{ name: 'aaron' }, 9] }
          , mpath.get('first.second', o)
        );

        assert.deepEqual(
          [3,{ name: 'aaron' }, 9]
          , mpath.get('first.second.third', o)
        );

        assert.deepEqual(
          3
          , mpath.get('first.second.third.0', o)
        );

        assert.deepEqual(
          9
          , mpath.get('first.second.third.2', o)
        );

        assert.deepEqual(
          { name: 'aaron' }
          , mpath.get('first.second.third.1', o)
        );

        assert.deepEqual(
          'aaron'
          , mpath.get('first.second.third.1.name', o)
        );

        assert.deepEqual([
            { name: 'one' }
          , { name: 'two', _doc: { name: '2' }}
          , { name: 'three'
            , comments: [{},{ comments: [{val: 'twoo'}]}]
            , _doc: { name: '3', comments: [{},{ _doc: { comments: [{ val: 2 }] }}]}}],
          mpath.get('comments', o));

        assert.deepEqual({ name: 'one' }, mpath.get('comments.0', o));
        assert.deepEqual('one', mpath.get('comments.0.name', o));
        assert.deepEqual('two', mpath.get('comments.1.name', o));
        assert.deepEqual('three', mpath.get('comments.2.name', o));

        assert.deepEqual([{},{ comments: [{val: 'twoo'}]}]
            , mpath.get('comments.2.comments', o));

        assert.deepEqual({ comments: [{val: 'twoo'}]}
            , mpath.get('comments.2.comments.1', o));

        assert.deepEqual('twoo', mpath.get('comments.2.comments.1.comments.0.val', o));

        done();
      })

      it('handles array.property dot-notation', function(done){
        assert.deepEqual(
            ['one', 'two', 'three']
          , mpath.get('comments.name', o)
        );
        done();
      })

      it('handles array.array notation', function(done){
        assert.deepEqual(
            [undefined, undefined, [{}, {comments:[{val:'twoo'}]}]]
          , mpath.get('comments.comments', o)
        );
        done();
      })

      it('handles prop.prop.prop.arrayProperty notation', function(done){
        assert.deepEqual(
          [undefined, 'aaron', undefined]
          , mpath.get('first.second.third.name', o)
        );
        done();
      })

      it('handles array.prop.array', function(done){
        assert.deepEqual(
            [ [{x: {b: [4,6,8]}}, { y: 10} ]
            , [{x: {b: [1,2,3]}}, { x: {z: 10 }}, { x: {b: 'hi'}}]
            , [{x: {b: null }}, { x: { b: [null, 1]}}]
            , [{x: null }]
            , [{y: 3 }]
            , [3, 0, null]
            , undefined
            ]
          , mpath.get('array.o.array', o)
        );
        done();
      })

      it('handles array.prop.array.index', function(done){
        assert.deepEqual(
            [ {x: {b: [4,6,8]}}
            , {x: {b: [1,2,3]}}
            , {x: {b: null }}
            , {x: null }
            , {y: 3 }
            , 3
            , undefined
            ]
          , mpath.get('array.o.array.0', o)
        );
        done();
      })

      it('handles array.prop.array.index.prop', function(done){
        assert.deepEqual(
            [ {b: [4,6,8]}
            , {b: [1,2,3]}
            , {b: null }
            , null
            , undefined
            , undefined
            , undefined
            ]
          , mpath.get('array.o.array.0.x', o)
        );
        done();
      })

      it('handles array.prop.array.prop', function(done){
        assert.deepEqual(
            [ [undefined, 10 ]
            , [undefined, undefined, undefined]
            , [undefined, undefined]
            , [undefined]
            , [3]
            , [undefined, undefined, undefined]
            , undefined
            ]
          , mpath.get('array.o.array.y', o)
        );
        assert.deepEqual(
            [ [{b: [4,6,8]}, undefined]
            , [{b: [1,2,3]},  {z: 10 }, {b: 'hi'}]
            , [{b: null }, { b: [null, 1]}]
            , [null]
            , [undefined]
            , [undefined, undefined, undefined]
            , undefined
            ]
          , mpath.get('array.o.array.x', o)
        );
        done();
      })

      it('handles array.prop.array.prop.prop', function(done){
        assert.deepEqual(
            [ [[4,6,8], undefined]
            , [[1,2,3], undefined, 'hi']
            , [null, [null, 1]]
            , [null]
            , [undefined]
            , [undefined, undefined, undefined]
            , undefined
            ]
          , mpath.get('array.o.array.x.b', o)
        );
        done();
      })

      it('handles array.prop.array.prop.prop.index', function(done){
        assert.deepEqual(
            [ [6, undefined]
            , [2, undefined, 'i'] // undocumented feature (string indexing)
            , [null, 1]
            , [null]
            , [undefined]
            , [undefined, undefined, undefined]
            , undefined
            ]
          , mpath.get('array.o.array.x.b.1', o)
        );
        done();
      })

      it('handles array.index.prop.prop', function(done){
        assert.deepEqual(
            [{x: {b: [1,2,3]}}, { x: {z: 10 }}, { x: {b: 'hi'}}]
          , mpath.get('array.1.o.array', o)
        );
        done();
      })

      it('handles array.array.index', function(done){
        assert.deepEqual(
            [{ a: { c: 48 }}, undefined]
          , mpath.get('arr.arr.1', o)
        );
        done();
      })

      it('handles array.array.index.prop', function(done){
        assert.deepEqual(
            [{ c: 48 }, undefined]
          , mpath.get('arr.arr.1.a', o)
        );
        done();
      })

      it('handles array.array.index.prop.prop', function(done){
        assert.deepEqual(
            [48, undefined]
          , mpath.get('arr.arr.1.a.c', o)
        );
        done();
      })

    })

    describe('with `special`', function(){
      it('works', function(done){
        assert.equal('jiro', mpath.get('name', o, '_doc'));

        assert.deepEqual(
          { second: { third: [3,{ name: 'aaron' }, 9] }}
          , mpath.get('first', o, '_doc')
        );

        assert.deepEqual(
          { third: [3,{ name: 'aaron' }, 9] }
          , mpath.get('first.second', o, '_doc')
        );

        assert.deepEqual(
          [3,{ name: 'aaron' }, 9]
          , mpath.get('first.second.third', o, '_doc')
        );

        assert.deepEqual(
          3
          , mpath.get('first.second.third.0', o, '_doc')
        );

        assert.deepEqual(
          9
          , mpath.get('first.second.third.2', o, '_doc')
        );

        assert.deepEqual(
          { name: 'aaron' }
          , mpath.get('first.second.third.1', o, '_doc')
        );

        assert.deepEqual(
          'aaron'
          , mpath.get('first.second.third.1.name', o, '_doc')
        );

        assert.deepEqual([
            { name: 'one' }
          , { name: 'two', _doc: { name: '2' }}
          , { name: 'three'
            , comments: [{},{ comments: [{val: 'twoo'}]}]
            , _doc: { name: '3', comments: [{},{ _doc: { comments: [{ val: 2 }] }}]}}],
          mpath.get('comments', o, '_doc'));

        assert.deepEqual({ name: 'one' }, mpath.get('comments.0', o, '_doc'));
        assert.deepEqual('one', mpath.get('comments.0.name', o, '_doc'));
        assert.deepEqual('2', mpath.get('comments.1.name', o, '_doc'));
        assert.deepEqual('3', mpath.get('comments.2.name', o, '_doc'));

        assert.deepEqual([{},{ _doc: { comments: [{ val: 2 }] }}]
            , mpath.get('comments.2.comments', o, '_doc'));

        assert.deepEqual({ _doc: { comments: [{val: 2}]}}
            , mpath.get('comments.2.comments.1', o, '_doc'));

        assert.deepEqual(2, mpath.get('comments.2.comments.1.comments.0.val', o, '_doc'));
        done();
      })

      it('handles array.property dot-notation', function(done){
        assert.deepEqual(
          ['one', '2', '3']
          , mpath.get('comments.name', o, '_doc')
        );
        done();
      })

      it('handles array.array notation', function(done){
        assert.deepEqual(
            [undefined, undefined, [{}, {_doc: { comments:[{val:2}]}}]]
          , mpath.get('comments.comments', o, '_doc')
        );
        done();
      })

      it('handles array.array.index.array', function(done){
        assert.deepEqual(
            [undefined, undefined, [{val:2}]]
          , mpath.get('comments.comments.1.comments', o, '_doc')
        );
        done();
      })

      it('handles array.array.index.array.prop', function(done){
        assert.deepEqual(
            [undefined, undefined, [2]]
          , mpath.get('comments.comments.1.comments.val', o, '_doc')
        );
        done();
      })
    })

  })

  describe('set', function(){
    it('works without `special`', function(done){
      mpath.set('name', 'changed', o);
      assert.deepEqual('changed', o.name);

      mpath.set('first.second.third', [1,{name:'x'},9], o);
      assert.deepEqual([1,{name:'x'},9], o.first.second.third);

      mpath.set('first.second.third.1.name', 'y', o)
      assert.deepEqual([1,{name:'y'},9], o.first.second.third);

      mpath.set('comments.1.name', 'ttwwoo', o);
      assert.deepEqual({ name: 'ttwwoo', _doc: { name: '2' }}, o.comments[1]);

      mpath.set('comments.2.comments.1.comments.0.expand', 'added', o);
      assert.deepEqual(
          { val: 'twoo', expand: 'added'}
        , o.comments[2].comments[1].comments[0]);

      mpath.set('comments.2.comments.1.comments.2', 'added', o);
      assert.equal(3, o.comments[2].comments[1].comments.length);
      assert.deepEqual(
          { val: 'twoo', expand: 'added'}
        , o.comments[2].comments[1].comments[0]);
      assert.deepEqual(
          undefined
        , o.comments[2].comments[1].comments[1]);
      assert.deepEqual(
          'added'
        , o.comments[2].comments[1].comments[2]);

      done();
    })
    it('works with `special`', function(done){
      mpath.set('name', 'changer', o, '_doc');
      assert.deepEqual('changer', o.name);

      mpath.set('first.second.third', [1,{name:'y'},9], o, '_doc');
      assert.deepEqual([1,{name:'y'},9], o.first.second.third);

      mpath.set('first.second.third.1.name', 'z', o, '_doc')
      assert.deepEqual([1,{name:'z'},9], o.first.second.third);

      mpath.set('comments.1.name', 'two', o, '_doc');
      assert.deepEqual({ name: 'ttwwoo', _doc: { name: 'two' }}, o.comments[1]);

      mpath.set('comments.2.comments.1.comments.0.expander', 'adder', o, '_doc');
      assert.deepEqual(
          { val: 2, expander: 'adder'}
        , o.comments[2]._doc.comments[1]._doc.comments[0]);

      mpath.set('comments.2.comments.1.comments.2', 'set', o, '_doc');
      assert.equal(3, o.comments[2]._doc.comments[1]._doc.comments.length);
      assert.deepEqual(
          { val: 2, expander: 'adder'}
        , o.comments[2]._doc.comments[1]._doc.comments[0]);
      assert.deepEqual(
          undefined
        , o.comments[2]._doc.comments[1]._doc.comments[1]);
      assert.deepEqual(
          'set'
        , o.comments[2]._doc.comments[1]._doc.comments[2]);
      done();
    })
  })

})
