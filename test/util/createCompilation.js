'use strict';

module.exports = () => ({
    clientStats: {
        toString() {
            return [
                'Asset    Size',
                'foo.js   10Kb',
            ].join('\n');
        },

        startTime: 0,
        endTime: 0,
    },
    serverStats: {
        toString() {
            return [
                'Asset    Size',
                'bar.js   10Kb',
            ].join('\n');
        },

        startTime: 0,
        endTime: 0,
    },
    duration: 0,
});
