'use strict';
const setTokenizerCache = require('../lib/tokenizer.js').setTokenizerCache;

setTokenizerCache(new Map());
require('./tokenizer');
require('./get');
require('./has');
require('./set');
require('./set-nested-array');
require('./unset');