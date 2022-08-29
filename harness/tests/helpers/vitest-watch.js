const chokidar = require('chokidar');
const { spawn } = require('child_process');
const debounce = require('lodash.debounce');

const yargs = require('yargs/yargs');

let runMode = 'run'; // run or related (no watch)

/** get and normalize arguments that will be appended to the command  */
let argv = process.argv.slice(2);
// console.debug(`[vitest-watch/()]-8: argv: %o`, argv);
argv = yargs(argv).argv;
// console.debug(`[vitest-watch/()]-62: argv: %o`, argv);
let args = '';
for (const k in argv) {
  if (/\$0/.test(k)) continue;
  let v = argv[k];
  if (k === '_') {
    // remove watch and related commands
    let i = v.findIndex((e) => e === 'watch');
    if (~i) v.splice(i, 1);
    i = v.findIndex((e) => e === 'related');
    if (~i) {
      v.splice(i, 1);
      runMode = 'related --run'; // change run mode to related and impose run, see vitest
    }
    // others commands just join into a sentence (these are probably files or directories)
    args += v.join(' ');
  } else {
    if (/^w$|^watch$/.test(k)) continue; // ignore watch

    let kk = k.length > 1 ? `--${k}` : `-${k}`;
    if (typeof v === 'boolean') args += ` ${kk}`;
    else if (typeof v === 'string') args += ` ${kk}=\'${v}\'`;
    else args += ` ${kk}=${v}`;
  }
}
console.debug(`[vitest-watch/()]-62: runMode: %o, args: %o`, runMode, args);

const vitestConfig = require('../../vitest.config.js');
startWatching({
  // cwd:              process.env.PWD,
  command:  `yarn vitest ${runMode} ${args}`,
  patterns: vitestConfig.test.forceRerunTriggers ?? '.',

  debounce: 400,
  verbose:  false,
  silent:   true,

  ignored:            vitestConfig.test.watchExclude ?? null,
  followSymlinks:     true,
  polling:            false,
  pollInterval:       100,
  pollIntervalBinary: 300,
  ignoreInitial:      false,
  awaitWriteFinish:   {
    stabilityThreshold: 2000,
    pollInterval:       100,
  },
});


const EVENT_DESCRIPTIONS = {
  add:       'File added',
  addDir:    'Directory added',
  unlink:    'File removed',
  unlinkDir: 'Directory removed',
  change:    'File changed',
};


// Estimates spent working hours based on commit dates
function startWatching (opts) {
  const watcher = chokidar.watch(opts.patterns, opts);

  let debouncedRun = run;
  if (opts.debounce > 0) {
    debouncedRun = debounce(run, opts.debounce);
  }

  watcher.on('all', (event, path) => {
    const description = `${EVENT_DESCRIPTIONS[event]}:`;

    if (opts.verbose) {
      console.error(description, path);
    } else if (!opts.silent) {
      console.log(`${event}:${path}`);
    }

    debouncedRun(opts.command);
  });

  watcher.on('error', error => {
    console.error('Error:', error);
    console.error(error.stack);
  });

  watcher.once('ready', () => {
    const list = opts.patterns.join('", "');
    if (!opts.silent) {
      console.error('Watching', `"${list}" ..`);
    }
  });
}


function run (cmd) {
  return runCmd(cmd)
    .catch(error => {
      console.error('Error when executing', cmd);
      console.error(error.stack);
    });
}


// Try to resolve path to shell.
// We assume that Windows provides COMSPEC env variable
// and other platforms provide SHELL env variable
const SHELL_PATH = process.env.SHELL || process.env.COMSPEC;
const EXECUTE_OPTION = process.env.COMSPEC !== undefined && process.env.SHELL === undefined ? '/c' : '-c';

// XXX: Wrapping tos to a promise is a bit wrong abstraction. Maybe RX suits
// better?
function runCmd (cmd, opts) {
  if (!SHELL_PATH) {
    // If we cannot resolve shell, better to just crash
    throw new Error('$SHELL environment variable is not set.');
  }

  opts = {
    pipe: true,
    cwd:  process.env.PWD,
    callback (child) { // eslint-disable-line no-unused-vars
      // Since we return promise, we need to provide
      // this callback if one wants to access the child
      // process reference
      // Called immediately after successful child process
      // spawn
    }, ...opts,
  };

  return new Promise((resolve, reject) => {
    let child;

    try {
      child = spawn(SHELL_PATH, [EXECUTE_OPTION, cmd], {
        cwd:   opts.cwd,
        stdio: opts.pipe ? 'inherit' : null,
      });
    } catch (error) {
      return reject(error);
    }

    opts.callback(child);


    function errorHandler (err) {
      child.removeListener('close', closeHandler);
      reject(err);
    }


    function closeHandler (exitCode) {
      child.removeListener('error', errorHandler);
      resolve(exitCode);
    }


    child.once('error', errorHandler);
    child.once('close', closeHandler);
  });
}
