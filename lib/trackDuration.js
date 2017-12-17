'use strict';

function trackDuration(compiler) {
    let beginAt;

    const onBegin = () => { beginAt = Date.now(); };
    const onEnd = (stats) => {
        Object.defineProperty(stats, 'duration', {
            value: Date.now() - beginAt,
            enumerable: false,
            configurable: true,
        });
    };

    compiler.on('begin', onBegin);
    compiler.on('end', onEnd);

    return () => {
        compiler.removeListener('begin', onBegin);
        compiler.removeListener('end', onEnd);
    };
}

module.exports = trackDuration;
