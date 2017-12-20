'use strict';

const { symbols } = require('webpack-sane-compiler-reporter');

/* istanbul ignore next */
const hrSymbol = process.platform !== 'win32' ? '━' : '-';

module.exports = {
    ...symbols,
    separator: hrSymbol,
};
