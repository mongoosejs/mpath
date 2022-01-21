'use strict';
const setTokenizerCache = require('../lib/stringToParts.js').setTokenizerCache;
const lru = require('lru-cache')

setTokenizerCache(new lru());
require('./stringToParts');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');