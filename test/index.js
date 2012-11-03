
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

  describe('get', function(){
    it('works without `special`', function(done){
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

    it('works with `special`', function(done){
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
