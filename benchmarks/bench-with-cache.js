'use strict';
const settokenizeCache = require('../lib/tokenize.js').settokenizeCache;

settokenizeCache(new Map());
require('./tokenize');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');