'use strict';

const startSaneReporting = require('webpack-sane-compiler-reporter');
const indentString = require('indent-string');
const wrap = require('lodash.wrap');
const renderers = require('./lib/renderers');
const trackDuration = require('./lib/trackDuration');
const checkHumanErrors = require('./lib/checkHumanErrors');

function startReporting(compiler, options) {
    options = {
        humanErrors: true,

        printSuccess: ({ duration }) => `${renderers.success(duration)}\n\n`,
        printStats: ({ client, server }) => {
            let str = '';

            str += `${renderers.banner('CLIENT')}\n`;
            str += `${renderers.stats(client)}\n\n`;

            str += `${renderers.banner('SERVER')}\n`;
            str += `${renderers.stats(server)}\n\n`;

            return indentString(str, 4);
        },
        ...options,
    };

    // Track the duration of each compilation and add it to the stats
    const untrackDuration = trackDuration(compiler);

    // Start reporting
    const reporter = startSaneReporting(compiler, options);

    // Check for human errors
    reporter.options.humanErrors && compiler.once('begin', () => checkHumanErrors(compiler, reporter.options));

    // Cleanup duration tracking when stopping
    reporter.stop = wrap(reporter.stop, (stop) => {
        untrackDuration();
        stop();
    });

    return reporter;
}

module.exports = startReporting;
module.exports.renderers = renderers;
