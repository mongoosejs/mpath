declare namespace mpath {
  // path type string[] because https://github.com/aheckmann/mpath/blob/634a0fa0f97bf1d00791647e3094273ba360a9ed/lib/index.js#L79
  type PathType = string | string[]
  type ObjectType = Record<any, any>
  type MapFunction = (val: any) => any
  type SpecialLookupFunctionGetter = (objChildItem: any, lookupPath: string | number) => any
  type SpecialLookupGetterType = string | SpecialLookupFunctionGetter

  type SpecialLookupFunctionSetter = (objChildItem: any, lookupPath: string | number, val?: any) => any
  type SpecialLookupSetterType = string | SpecialLookupFunctionSetter

  function get<R = any>(path: PathType, obj: ObjectType): R
  function get<R = any>(path: PathType, obj: ObjectType, special: SpecialLookupGetterType): R
  function get<R = any>(path: PathType, obj: ObjectType, map: MapFunction): R
  /**
   * Returns the value of object `obj` at the given `path`.
   *
   * @example
   * var obj = {
   *    comments: [
   *        { title: 'exciting!', _doc: { title: 'great!' }}
   *      , { title: 'number dos' }
   *    ]
   * }
   *
   * mpath.get('comments.0.title', o)         // 'exciting!'
   * mpath.get('comments.0.title', o, '_doc') // 'great!'
   * mpath.get('comments.title', o)           // ['exciting!', 'number dos']
   *
   * // summary
   * mpath.get(path, o)
   * mpath.get(path, o, special)
   * mpath.get(path, o, map)
   * mpath.get(path, o, special, map)
   *
   * @param {String | String[]} path MongoDB-like path notation
   * @param {Object} obj target object
   * @param {SpecialLookupGetterType} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
   * @param {MapFunction} [map] Optional function which receives each individual found value. The value returned from `map` is used in the original values place.
   */
  function get<R = any>(path: PathType, obj: ObjectType, special: SpecialLookupGetterType, map: MapFunction): R

  /**
   * Returns true if `in` returns true for every piece of the path
   *
   * @param {String | String[]} path MongoDB-like path notation
   * @param {Object} obj target object
   * @return Boolean
   */
  function has(path: PathType, obj: ObjectType): boolean

  /**
   * Deletes the last piece of `path`
   *
   * @param {String | String[]} path MongoDB-like path notation
   * @param {Object} obj target object
   * @return Boolean
   */
  function unset(path: PathType, obj: ObjectType): boolean

  function set(path: PathType, val: any, obj: ObjectType): void
  function set(path: PathType, val: any, obj: ObjectType, special: SpecialLookupSetterType): void
  function set(path: PathType, val: any, obj: ObjectType, map: MapFunction): void
  /**
   * Sets the `val` at the given `path` of object `obj`.
   *
   * @param {String | String[]} path MongoDB-like path notation
   * @param {any} val value
   * @param {Object} obj target object
   * @param {String} [special] When this property name is present on any object in the path, walking will continue on the value of this property.
   * @param {Function} [map] Optional function which is passed each individual value before setting it. The value returned from `map` is used in the original values place.
   * @param {Boolean} [_copying] the existence of `$` in a path tells us if the user desires the copying of an array instead of setting each value of the array to the one by one to matching positions of the current array. Unless the user explicitly opted out by passing false, see https://github.com/Automattic/mongoose/issues/6273
   */
  function set(path: PathType, val: any, obj: ObjectType, special: SpecialLookupSetterType, map: MapFunction, _copying?: boolean): void
}

export = mpath
