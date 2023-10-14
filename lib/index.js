'use strict';

const stringToParts = require('./stringToParts').stringToParts;

exports.stringToParts = stringToParts;
exports.stringToParts = stringToParts;

// These properties are special and can open client libraries to security
// issues
const ignoreProperties = new Set(['__proto__', 'constructor', 'prototype']);

const numberRE = /^\d+$/;

/**
 * Returns the value of object `o` at the given `path`.
 *
 * @example
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

exports.get = function get(path, o, special, map) {

  if (o === null) return;


  let lookup;

  if (typeof special === 'function') {
    if (special.length < 2) {
      map = special;
      special = undefined;
    } else {
      lookup = special;
      special = undefined;
    }
  }

  let obj = o,
      i = 0;
  const parts = getPartsByPath(path),
      len = parts.length;

  for (; i < len; ++i) {

    if (Array.isArray(obj) && !numberRE.test(parts[i])) {
      // reading a property from the array items
      const paths = parts.slice(i);

      let j = 0;
      const jl = obj.length;
      const result = new Array(jl);
      for (; j < jl; j++) {
        result[j] = obj[j]
          ? exports.get(paths, obj[j], special || lookup, map)
          : map && map(undefined);
      }
      return result;
    }

    if (lookup) {
      obj = lookup(obj, parts[i]);
    } else {
      const _from = special && obj[special] ? obj[special] : obj;
      obj = _from instanceof Map ?
        _from.get(parts[i]) :
        _from[parts[i]];
    }

    if (!obj) break;
  }

  if (map) {
    return map(obj);
  }
  return obj;
};

/**
 * Returns true if `in` returns true for every piece of the path
 *
 * @param {String} path
 * @param {Object} o
 */

exports.has = function has(path, o) {

  if (o === null) return false;

  const parts = getPartsByPath(path),
      len = parts.length - 1;
  let i = 0,
      cur = o;

  for (i = 0; i < len; ++i) {
    if (typeof cur !== 'object' || cur === null || !(parts[i] in cur)) {
      return false;
    }
    cur = cur[parts[i]];
  }

  return typeof cur === 'object' && cur !== null && parts[i] in cur;
};

/**
 * Deletes the last piece of `path`
 *
 * @param {String} path
 * @param {Object} o
 */

exports.unset = function(path, o) {

  if (o === null) return false;

  const parts = getPartsByPath(path),
      last = parts.length - 1;

  return _unsetNext(o, parts, 0, last);
};

function _unsetNext(cur, parts, i, last) {
  const part = parts[i];

  if (
    ignoreProperties.has(part) ||
    !((typeof cur === 'object' && cur !== null && part in cur) || Array.isArray(cur)) ||
    cur === null
  ) {
    return false;
  }

  if (i === last) {
    return delete cur[part];
  } else if (Array.isArray(cur[part])) {
    return cur[parts[i]].reduce((acc, next) => acc && _unsetNext(next, parts, i + 1, last), true);
  } else {
    return _unsetNext(cur instanceof Map ? cur.get(part) : cur[part], parts, i + 1, last);
  }
}

/**
 * Sets the `val` at the given `path` of object `o`.
 *
 * @param {String} path
 * @param {any} val
 * @param {Object} o
 * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
 * @param {Function} [map] Optional function which is passed each individual value before setting it. The value returned from `map` is used in the original values place.
 */

exports.set = function set(path, val, o, special, map, copy) {

  if (o === null) return;

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

  const parts = getPartsByPath(path),
      len = parts.length - 1,
      last = parts.length - 2;

  let obj = o,
      part,
      i = 0,
      j = 0,
      jl = 0;

  for (i = 0; i < len; ++i) {
    part = parts[i];

    // Silently ignore any updates to `__proto__`, these are potentially
    // dangerous if using mpath with unsanitized data.
    if (ignoreProperties.has(part)) {
      return;
    }

    if (part === '$') {
      if (i === last) {
        break;
      }
      continue;
    }

    if (Array.isArray(obj) && !numberRE.test(part)) {
      // the existence of $ in a path tells us if the user desires
      // the copying of an array instead of setting each value of
      // the array to the one by one to matching positions of the
      // current array. Unless the user explicitly opted out by passing
      // false, see Automattic/mongoose#6273
      (typeof copy === 'undefined') && (copy = copy || (copy !== false && path.indexOf('$') !== -1) || false);
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
      const _to = special && obj[special] ? obj[special] : obj;
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
    // the existence of $ in a path tells us if the user desires
    // the copying of an array instead of setting each value of
    // the array to the one by one to matching positions of the
    // current array. Unless the user explicitly opted out by passing
    // false, see Automattic/mongoose#6273
    (typeof copy === 'undefined') && (copy = copy || (copy !== false && path.indexOf('$') !== -1));
    if (!copy && Array.isArray(val)) {
      _setArray(obj, val, part, lookup, special, map);
    } else {
      for (j = 0; j < obj.length; ++j) {
        let item = obj[j];
        if (item) {
          if (lookup) {
            lookup(item, part, map(val));
          } else if (typeof item === 'object') {
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
  } else if (typeof obj === 'object') {
    obj[part] = map(val);
  }
};

/*!
 * Recursively set nested arrays
 */

function _setArray(obj, val, part, lookup, special, map) {
  let item,
      j = 0;
  for (j = 0; j < obj.length && j < val.length; ++j) {
    item = obj[j];
    if (Array.isArray(item) && Array.isArray(val[j])) {
      _setArray(item, val[j], part, lookup, special, map);
    } else if (item) {
      if (lookup) {
        lookup(item, part, map(val[j]));
      } else if (typeof item === 'object') {
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

function getPartsByPath(path) {
  if (typeof path === 'string') {
    return stringToParts(path);
  }
  if (Array.isArray(path)) {
    let i = 0;
    const len = path.length;
    for (i = 0; i < len; ++i) {
      if (typeof path[i] !== 'string' && typeof path[i] !== 'number') {
        throw new TypeError('Each segment of path to `set()` must be a string or number, got ' + typeof path[i]);
      }
    }
    return path;
  }
  throw new TypeError('Invalid `path`. Must be either string or array');
}
