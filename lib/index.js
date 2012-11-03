
/**
 * Returns the value of object `o` at the given `path`.
 *
 * ####Example:
 *
 *     var obj = {
 *         comments: [
 *             { title: 'exciting!', _doc: { title: 'great!' }}
 *         ]
 *     }
 *
 *     mpath.getValue('comments.0.title', o)         // 'exciting!'
 *     mpath.getValue('comments.0.title', o, '_doc') // 'great!'
 *
 * @param {String} path
 * @param {Object} o
 * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
 */

exports.get = function (path, o, special) {
  var parts = path.split('.')
    , obj = o
    , part;

  for (var i = 0; i < parts.length; ++i) {
    part = parts[i];
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
