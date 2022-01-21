'use strict';
const setTokenizeCache = require('../lib/tokenize.js').setTokenizeCache;

setTokenizeCache(new Map());
require('./tokenize');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');