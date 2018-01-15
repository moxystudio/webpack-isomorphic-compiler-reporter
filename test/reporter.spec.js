'use strict';

const path = require('path');
const createReporter = require('../');
const createCompiler = require('./util/createCompiler');
const createCompilation = require('./util/createCompilation');
const createWritter = require('./util/createWritter');

it('should render the correct output on success', () => {
    const compiler = createCompiler();
    const writter = createWritter();
    const compilation = createCompilation();

    createReporter(compiler, { write: writter });

    compiler.emit('begin');
    compiler.emit('end', compilation);

    expect(writter.getOutput()).toMatchSnapshot();
});

it('should render the correct output on failure', () => {
    const compiler = createCompiler();
    const writter = createWritter();
    const error = Object.assign(new Error('Error message'), {
        stack: [
            'at method1 (/path/to/file1.js:1:0)',
            'at method2 (/path/to/file2.js:1:0)',
        ].join('\n'),
    });

    createReporter(compiler, { stats: 'once', write: writter });

    compiler.emit('begin');
    compiler.emit('error', error);

    expect(writter.getOutput()).toMatchSnapshot();
});

it('should output the correct duration', () => {
    const compiler = createCompiler();
    const writter = createWritter();
    const compilation = createCompilation();

    createReporter(compiler, { write: writter });

    compiler.emit('begin');
    compiler.emit('end', compilation);

    compilation.duration = 200;
    compiler.emit('begin');
    compiler.emit('end', compilation);

    expect(writter.getOutput()).toMatchSnapshot();
});

describe('human errors', () => {
    it('should warn about all human errors', () => {
        const badServerConfig = {
            entry: path.resolve(`${__dirname}/files/simple.js`),
            output: {
                path: '/foo',
                publicPath: '/foo/',
                filename: 'server.js',
            },
            devtool: 'eval-source-map',
        };
        const compiler = createCompiler({
            server: { webpackConfig: badServerConfig },
        });
        const writter = createWritter();

        createReporter(compiler, { write: writter });

        compiler.emit('begin');

        expect(writter.getOutput()).toMatchSnapshot();
    });

    it('should not warn about human errors if `options.humanErrors` is false', () => {
        const badServerConfig = {
            entry: path.resolve(`${__dirname}/files/simple.js`),
            output: {
                path: path.resolve(`${__dirname}/../tmp`),
                filename: 'server.js',
            },
            devtool: 'eval-source-map',
        };
        const compiler = createCompiler({
            server: { webpackConfig: badServerConfig },
        });
        const writter = createWritter();

        createReporter(compiler, {
            write: writter,
            humanErrors: false,
        });

        compiler.emit('begin');

        expect(writter.getOutput()).toMatchSnapshot();
    });

    it('should stop reporting if stop was called', () => {
        const compiler = createCompiler();
        const writter = createWritter();
        const compilation = createCompilation();

        const { stop } = createReporter(compiler, { write: writter });

        compiler.emit('begin');
        compiler.emit('end', compilation);

        stop();

        compiler.emit('begin');
        compiler.emit('end', compilation);

        expect(writter.getOutput()).toMatchSnapshot();
    });
});
