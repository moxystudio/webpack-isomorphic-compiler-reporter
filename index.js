'use strict';

const startSaneReporting = require('webpack-sane-compiler-reporter');
const indentString = require('indent-string');

const renderers = require('./lib/renderers');
const symbols = require('./lib/symbols');
const checkHumanErrors = require('./lib/checkHumanErrors');

function startReporting(compiler, options) {
    options = {
        humanErrors: true,

        printStats: ({ clientStats, serverStats }) => {
            let str = '';

            str += `${renderers.banner('CLIENT')}\n`;
            str += `${renderers.stats(clientStats)}\n\n`;

            str += `${renderers.banner('SERVER')}\n`;
            str += `${renderers.stats(serverStats)}\n\n`;

            return indentString(str, 4);
        },
        ...options,
    };

    // Start reporting
    const reporter = startSaneReporting(compiler, options);

    // Check for human errors
    reporter.options.humanErrors && compiler.once('begin', () => checkHumanErrors(compiler, reporter.options));

    return reporter;
}

module.exports = startReporting;
module.exports.renderers = renderers;
module.exports.symbols = symbols;
