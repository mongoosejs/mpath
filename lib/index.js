/* eslint strict:off */
/* eslint no-var: off */
/* eslint no-redeclare: off */

var stringToParts = require('./stringToParts');

// These properties are special and can open client libraries to security
// issues
const ignoreProperties = new Set(['__proto__', 'constructor', 'prototype']);

const numberRE = /^\d+$/;

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
 *     // summary
 *     mpath.get(path, o)
 *     mpath.get(path, o, special)
 *     mpath.get(path, o, map)
 *     mpath.get(path, o, special, map)
 *
 * @param {String} path
 * @param {Object} o
 * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
 * @param {Function} [map] Optional function which receives each individual found value. The value returned from `map` is used in the original values place.
 */

exports.get = function(path, o, special, map) {

  let parts;

  if (typeof path === 'string') {
    parts = stringToParts(path);
  } else if (Array.isArray(path)) {
    parts = path;
  } else {
    throw new TypeError('Invalid `path`. Must be either string or array');
  }
  let lookup;

  if ('function' == typeof special) {
    if (special.length < 2) {
      map = special;
      special = undefined;
    } else {
      lookup = special;
      special = undefined;
    }
  }

  map || (map = K);

  let obj = o,
      part,
      i = 0,
      len = parts.length;

  for (; i < len; ++i) {
    part = parts[i];
    if (typeof part !== 'string' && typeof part !== 'number') {
      throw new TypeError('Each segment of path to `get()` must be a string or number, got ' + typeof part);
    }

    if (Array.isArray(obj) && !numberRE.test(part)) {
      // reading a property from the array items
      const paths = parts.slice(i);

      // Need to `concat()` to avoid `map()` calling a constructor of an array
      // subclass
      return Array.prototype.concat.call([], obj).map(function(item) {
        return item
          ? exports.get(paths, item, special || lookup, map)
          : map(undefined);
      });
    }

    if (lookup) {
      obj = lookup(obj, part);
    } else {
      const _from = special && obj[special] ? obj[special] : obj;
      obj = _from instanceof Map ?
        _from.get(part) :
        _from[part];
    }

    if (!obj) return map(obj);
  }

  return map(obj);
};

/**
 * Returns true if `in` returns true for every piece of the path
 *
 * @param {String} path
 * @param {Object} o
 */

exports.has = function(path, o) {
  var parts = typeof path === 'string' ?
    stringToParts(path) :
    path;

  if (!Array.isArray(parts)) {
    throw new TypeError('Invalid `path`. Must be either string or array');
  }

  var len = parts.length;
  var cur = o;
  for (var i = 0; i < len; ++i) {
    if (typeof parts[i] !== 'string' && typeof parts[i] !== 'number') {
      throw new TypeError('Each segment of path to `has()` must be a string or number, got ' + typeof parts[i]);
    }
    if (cur == null || typeof cur !== 'object' || !(parts[i] in cur)) {
      return false;
    }
    cur = cur[parts[i]];
  }

  return true;
};

/**
 * Deletes the last piece of `path`
 *
 * @param {String} path
 * @param {Object} o
 */

exports.unset = function(path, o) {
  var parts = typeof path === 'string' ?
    stringToParts(path) :
    path;

  if (!Array.isArray(parts)) {
    throw new TypeError('Invalid `path`. Must be either string or array');
  }

  var len = parts.length;
  var cur = o;
  for (var i = 0; i < len; ++i) {
    if (cur == null || typeof cur !== 'object' || !(parts[i] in cur)) {
      return false;
    }
    if (typeof parts[i] !== 'string' && typeof parts[i] !== 'number') {
      throw new TypeError('Each segment of path to `unset()` must be a string or number, got ' + typeof parts[i]);
    }
    // Disallow any updates to __proto__ or special properties.
    if (ignoreProperties.has(parts[i])) {
      return false;
    }
    if (i === len - 1) {
      delete cur[parts[i]];
      return true;
    }
    cur = cur instanceof Map ? cur.get(parts[i]) : cur[parts[i]];
  }

  return true;
};

/**
 * Sets the `val` at the given `path` of object `o`.
 *
 * @param {String} path
 * @param {Anything} val
 * @param {Object} o
 * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
 * @param {Function} [map] Optional function which is passed each individual value before setting it. The value returned from `map` is used in the original values place.
 */

exports.set = function set(path, val, o, special, map, _copying) {

  if (null == o) return;

  let parts;

  if (typeof path === 'string') {
    parts = stringToParts(path);
  } else if (Array.isArray(path)) {
    parts = path;
  } else {
    throw new TypeError('Invalid `path`. Must be either string or array');
  }

  let lookup;

  if ('function' == typeof special) {
    if (special.length < 2) {
      map = special;
      special = undefined;
    } else {
      lookup = special;
      special = undefined;
    }
  }

  map || (map = K);

  // the existence of $ in a path tells us if the user desires
  // the copying of an array instead of setting each value of
  // the array to the one by one to matching positions of the
  // current array. Unless the user explicitly opted out by passing
  // false, see Automattic/mongoose#6273
  let copy = _copying || (_copying !== false && path.indexOf('$') !== -1),
      obj = o,
      part,
      i = 0,
      len = parts.length - 1,
      last = parts.length - 2,
      j = 0,
      jl = 0;

  for (i = 0; i < len; ++i) {
    part = parts[i];

    if (typeof part !== 'string' && typeof part !== 'number') {
      throw new TypeError('Each segment of path to `set()` must be a string or number, got ' + typeof part);
    }

    // Silently ignore any updates to `__proto__`, these are potentially
    // dangerous if using mpath with unsanitized data.
    if (ignoreProperties.has(part)) {
      return;
    }

    if (part === '$') {
      if (i === last) {
        break;
      } else {
        continue;
      }
    }

    if (Array.isArray(obj) && !numberRE.test(part)) {
      const paths = parts.slice(i);
      if (!copy && Array.isArray(val)) {
        for (j = 0, jl = Math.min(obj.length, val.length); j < jl; ++j) {
          // assignment of single values of array
          set(paths, val[j], obj[j], special || lookup, map, copy);
        }
      } else {
        for (j = 0, jl = obj.length; j < jl; ++j) {
          // assignment of entire value
          set(paths, val, obj[j], special || lookup, map, copy);
        }
      }
      return;
    }

    if (lookup) {
      obj = lookup(obj, part);
    } else {
      var _to = special && obj[special] ? obj[special] : obj;
      obj = _to instanceof Map ?
        _to.get(part) :
        _to[part];
    }

    if (!obj) return;
  }

  // process the last property of the path

  part = parts[len];

  // use the special property if exists
  if (special && obj[special]) {
    obj = obj[special];
  }

  // set the value on the last branch
  if (Array.isArray(obj) && !numberRE.test(part)) {
    if (!copy && Array.isArray(val)) {
      _setArray(obj, val, part, lookup, special, map);
    } else {
      for (j = 0; j < obj.length; ++j) {
        var item = obj[j];
        if (item) {
          if (lookup) {
            lookup(item, part, map(val));
          } else {
            if (item[special]) item = item[special];
            item[part] = map(val);
          }
        }
      }
    }
    return;
  }

  if (lookup) {
    lookup(obj, part, map(val));
  } else if (obj instanceof Map) {
    obj.set(part, map(val));
  } else {
    obj[part] = map(val);
  }
};

/*!
 * Recursively set nested arrays
 */

function _setArray(obj, val, part, lookup, special, map) {
  for (var item, j = 0; j < obj.length && j < val.length; ++j) {
    item = obj[j];
    if (Array.isArray(item) && Array.isArray(val[j])) {
      _setArray(item, val[j], part, lookup, special, map);
    } else if (item) {
      if (lookup) {
        lookup(item, part, map(val[j]));
      } else {
        if (item[special]) item = item[special];
        item[part] = map(val[j]);
      }
    }
  }
}

/*!
 * Returns the value passed to it.
 */

function K(v) {
  return v;
}