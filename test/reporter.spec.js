'use strict';

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
