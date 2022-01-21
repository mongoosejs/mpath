'use strict';
const setTokenizeCache = require('../lib/tokenize.js').setTokenizeCache;
const lru = require('lru-cache');

setTokenizeCache(new lru());
require('./tokenize');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');