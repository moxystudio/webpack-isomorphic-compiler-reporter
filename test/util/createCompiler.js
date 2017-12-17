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
                    libraryTarget: 'this',
                },
                target: 'node',
            },
        },
    }, overrides);
};
