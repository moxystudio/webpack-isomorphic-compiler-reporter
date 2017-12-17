'use strict';

const path = require('path');
const createReporter = require('../');
const createCompiler = require('./util/createCompiler');
const createStats = require('./util/createStats');
const createWritter = require('./util/createWritter');

const dateNow = 1513447567843;

beforeEach(() => jest.spyOn(Date, 'now').mockImplementation(() => 1513447567843));
afterEach(() => jest.restoreAllMocks());

it('should render the correct output on success', () => {
    const compiler = createCompiler();
    const writter = createWritter();
    const stats = {
        client: createStats(),
        server: createStats(),
    };

    createReporter(compiler, { write: writter });

    compiler.emit('begin');
    compiler.emit('end', stats);

    expect(writter.getOutput()).toMatchSnapshot();
});

it('should render the correct output on failure', () => {
    const compiler = createCompiler();
    const writter = createWritter();
    const stats = createStats(true);
    const error = Object.assign(new Error('Error message'), {
        stats,
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

it('should calculate the correct duration', () => {
    const compiler = createCompiler();
    const writter = createWritter();
    const stats = {
        client: createStats(),
        server: createStats(),
    };

    createReporter(compiler, { write: writter });

    compiler.emit('begin');
    compiler.emit('end', stats);

    Date.now.mockImplementation(() => dateNow + 100);
    compiler.emit('begin');
    Date.now.mockImplementation(() => dateNow + 300);
    compiler.emit('end', stats);

    expect(writter.getOutput()).toMatchSnapshot();
});

describe('human errors', () => {
    it('should warn about all human errors', () => {
        const badServerConfig = {
            entry: path.resolve(`${__dirname}/files/simple.js`),
            output: {
                path: path.resolve(`${__dirname}/../tmp`),
                filename: 'client.js',
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
                filename: 'client.js',
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
        const stats = {
            client: createStats(),
            server: createStats(),
        };

        const { stop } = createReporter(compiler, { write: writter });

        compiler.emit('begin');
        compiler.emit('end', stats);

        stop();

        compiler.emit('begin');
        compiler.emit('end', stats);

        expect(writter.getOutput()).toMatchSnapshot();
    });
});
