#mpath

{G,S}et javascript object values using MongoDB path notation.

###Getting

```js
var mpath = require('mpath');

var obj = {
    comments: [
      { title: 'funny' },
      { title: 'exciting!' }
    ]
}

mpath.get('comments.1.title', obj) // 'exciting!'
```

###Setting

```js
var obj = {
    comments: [
      { title: 'funny' },
      { title: 'exciting!' }
    ]
}

mpath.set('comments.1.title', 'hilarious', obj)
console.log(obj.comments[1].title) // hilarious
```

### Custom object types

Sometimes you may want to enact the same functionality on custom object types that store all their real data internally, say for an ODM type object. No fear, `mpath` has you covered. Simply pass the name of the property being used to store the internal data and it will be traversed instead:

```js
var mpath = require('mpath');

var obj = {
    comments: [
      { title: 'exciting!', _doc: { title: 'great!' }}
    ]
}

mpath.get('comments.0.title', obj, '_doc')            // 'great!'
mpath.set('comments.0.title', 'nov 3rd', obj, '_doc')
mpath.get('comments.0.title', obj, '_doc')            // 'nov 3rd'
mpath.get('comments.0.title', obj)                    // 'exciting'
```

[LICENSE](https://github.com/aheckmann/mpath/blob/master/LICENSE)

