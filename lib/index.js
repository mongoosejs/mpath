
/**
 * Returns the value of object `o` at the given `path`.
 *
 * ####Example:
 *
 *     var obj = {
 *         comments: [
 *             { title: 'exciting!', _doc: { title: 'great!' }}
 *           , { title: 'number dos' }
 *         ]
 *     }
 *
 *     mpath.get('comments.0.title', o)         // 'exciting!'
 *     mpath.get('comments.0.title', o, '_doc') // 'great!'
 *     mpath.get('comments.title', o)           // ['exciting!', 'number dos']
 *
 * @param {String} path
 * @param {Object} o
 * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
 */

exports.get = function (path, o, special) {
  var parts = 'string' == typeof path
    ? path.split('.')
    : path

  if (!Array.isArray(parts)) {
    throw new TypeError('Invalid `path`. Must be either string or array');
  }

  var obj = o
    , part;

  for (var i = 0; i < parts.length; ++i) {
    part = parts[i];

    if (Array.isArray(obj) && !/^\d+$/.test(part)) {
      // reading a property from the array items
      var paths = parts.slice(i);

      return obj.map(function (item) {
        return item
          ? exports.get(paths, item, special)
          : undefined;
      });
    }

    obj = special && obj[special]
      ? obj[special][part]
      : obj[part];

    if (!obj) return obj;
  }

  return obj;
}

/**
 * Sets the `val` at the given `path` of object `o`.
 *
 * @param {String} path
 * @param {Anything} val
 * @param {Object} o
 * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
 */

exports.set = function (path, val, o, special) {
  var parts = path.split('.')
    , obj = o;

  for (var i = 0, len = parts.length - 1; i < len; ++i) {
    obj = special && obj[special]
      ? obj[special][parts[i]]
      : obj[parts[i]];
  }

  if (special && obj[special]) {
    obj = obj[special];
  }

  obj[parts[len]] = val;
}
