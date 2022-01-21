'use strict';
const setTokenizerCache = require('../lib/tokenizer.js').setTokenizerCache;
const lru = require('lru-cache');

setTokenizerCache(new lru());
require('./tokenizer');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');