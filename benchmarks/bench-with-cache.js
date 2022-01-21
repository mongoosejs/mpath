'use strict';
const setTokenizerCache = require('../lib/stringToParts.js').setTokenizerCache;

setTokenizerCache(new Map());
require('./stringToParts');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');