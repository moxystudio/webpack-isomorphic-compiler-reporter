'use strict';

const startSaneReporting = require('webpack-sane-compiler-reporter');
const indentString = require('indent-string');
const renderers = require('./lib/renderers');
const symbols = require('./lib/symbols');

function startReporting(compiler, options) {
    options = {
        printStats: ({ clientStats, serverStats }) => {
            let str = '';

            str += `\n${renderers.banner('CLIENT')}\n`;
            str += `${renderers.stats(clientStats)}\n`;

            str += `\n${renderers.banner('SERVER')}\n`;
            str += `${renderers.stats(serverStats)}\n\n`;

            return indentString(str, 4);
        },
        ...options,
    };

    // Start reporting
    return startSaneReporting(compiler, options);
}

module.exports = startReporting;
module.exports.renderers = renderers;
module.exports.symbols = symbols;
