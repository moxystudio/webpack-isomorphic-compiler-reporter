'use strict';

const chalk = require('chalk');
const { renderers } = require('webpack-sane-compiler-reporter');

/* istanbul ignore next */
const hrSymbol = process.platform !== 'win32' ? '━' : '-';

const renderBanner = (label) => {
    let str;

    str = `${chalk.inverse(` ${label} ${' '.repeat(35 - label.length - 1)}`)}\n`;
    str += chalk.dim(hrSymbol.repeat(35));

    return str;
};

module.exports = {
    ...renderers,
    banner: renderBanner,
};
