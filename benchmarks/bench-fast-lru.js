'use strict';
const setTokenizeCache = require('../lib/tokenize.js').setTokenizeCache;
const lru = require('fast-lru-cache');

setTokenizeCache(new lru(10000));
require('./tokenize');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');