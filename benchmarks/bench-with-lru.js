'use strict';
const settokenizeCache = require('../lib/tokenize.js').settokenizeCache;
const lru = require('lru-cache');

settokenizeCache(new lru());
require('./tokenize');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');