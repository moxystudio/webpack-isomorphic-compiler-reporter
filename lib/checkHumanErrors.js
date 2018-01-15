'use strict';

const chalk = require('chalk');

function checkServer(compiler, options) {
    const { webpackConfig } = compiler.server;
    let str = '';

    if (webpackConfig.target !== 'node') {
        str += `${chalk.yellow('WARN')}: Server \`output.target\` in webpack config should be set to \`node\`\n`;
        str += 'See https://webpack.js.org/configuration/target/#target\n\n';
    }
    if (webpackConfig.output.libraryTarget !== 'this' && webpackConfig.output.libraryTarget !== 'commonjs2') {
        str += `${chalk.yellow('WARN')}: Server \`output.libraryTarget\` in webpack config should be set to \`this\` or \`commonjs2\`\n`;
        str += 'See https://webpack.js.org/configuration/output/#output-librarytarget\n\n';
    }

    if (webpackConfig.devtool && webpackConfig.devtool !== 'source-map' && webpackConfig.devtool !== 'inline-source-map') {
        str += `${chalk.yellow('WARN')}: Server \`devtool\` in webpack config should be set to \`source-map\` or \`inline-source-map\`\n`;
        str += 'In addition, you must use https://github.com/evanw/node-source-map-support to enable source maps.\n\n';
    }

    str && options.write(str);
}

function checkOutputPaths(compiler, options) {
    const clientOutput = compiler.client.webpackConfig.output;
    const serverOutput = compiler.server.webpackConfig.output;
    let str = '';

    if (clientOutput.path !== serverOutput.path) {
        str += `${chalk.yellow('WARN')}: The \`output.path\` should be the same in the webpack client & server configs\n`;
        str += `Client output.path: ${clientOutput.path}\n`;
        str += `Server output.path: ${serverOutput.path}\n\n`;
    }
    if (clientOutput.publicPath !== serverOutput.publicPath) {
        str += `${chalk.yellow('WARN')}: The \`output.publicPath\` should be the same in the webpack client & server configs\n`;
        str += `Client output.publicPath: ${clientOutput.publicPath}\n`;
        str += `Server output.publicPath: ${serverOutput.publicPath}\n\n`;
    }

    str && options.write(str);
}

function checkHumanErrors(compiler, options) {
    // Check server configuration
    checkServer(compiler, options);

    // Check output configuration
    checkOutputPaths(compiler, options);
}

module.exports = checkHumanErrors;
