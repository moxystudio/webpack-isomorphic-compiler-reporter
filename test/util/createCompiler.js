'use strict';

const EventEmitter = require('events');

module.exports = (overrides = {}) => {
    const emiter = new EventEmitter();

    return Object.assign(emiter, {
        run() {
            return Promise.resolve();
        },

        watch() {
            return emiter;
        },

        unwatch() {
            return Promise.resolve();
        },

        server: {
            webpackConfig: {
                output: {
                    path: '/build',
                    publicPath: '/build/',
                    libraryTarget: 'this',
                },
                target: 'node',
            },
        },

        client: {
            webpackConfig: {
                output: {
                    path: '/build',
                    publicPath: '/build/',
                },
            },
        },
    }, overrides);
};
