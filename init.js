const fse = require('fs-extra');
const { resolve } = require('path');
const paths = require('./paths.js');
const { modifyPackageJsonFile } = require('modify-json-file');
// noinspection NpmUsedModulesInstalled
const { packageManager } = require('./dist/strapi-test-utils');

const pkg = JSON.parse(fse.readFileSync(resolve(paths.PLUGIN_DIR_PATH, './package.json'), { encoding: 'utf8' }));
const prjPkg = JSON.parse(fse.readFileSync(resolve(paths.CWD, './package.json'), { encoding: 'utf8' }));
const SERIAL = Date.now();


function log (str, ...rest) {
  console.log(`🛠  [${pkg.name}]: ${str}`, ...rest);
}


function log_warn (str, ...rest) {
  console.warn(`⚠️  [${pkg.name}]: ${str}`, ...rest);
}


function log_err (str, ...rest) {
  console.error(`❌  [${pkg.name}]: ${str}`, ...rest);
}


async function copy (sourcePath, targetPath, checkIfExists = true) {
  let exists;
  if (checkIfExists) {
    try {
      exists = await fse.pathExists(targetPath);
    } catch (err) {
      log_err(`Error checking if %o exists`, targetPath);
    }
  }
  
  if (!checkIfExists || !exists) {
    if (checkIfExists) log(`%o doesn't exists, adding...`, targetPath);
    log(`Copying to: %o...`, targetPath);
    try {
      await fse.copy(sourcePath, targetPath);
    } catch (err) {
      log_err(err);
    }
  } else {
    log_warn(`%o exists, NOT copying.`, targetPath);
  }
}


async function renameIfExistsAndCopy (sourcePath, targetPath) {
  let exists;
  try {
    exists = await fse.pathExists(targetPath);
  } catch (err) {
    log_err(`Error checking if %o exists`, targetPath);
  }
  
  if (!!exists) {
    const i = targetPath.lastIndexOf('.');
    const bck = ~i ? targetPath.substring(i, -1) + '.' + SERIAL + targetPath.substring(i) : targetPath + '.' + SERIAL;
    log(`%o exists, renaming to %o so you can migrate any customizations before deleting it...`, targetPath, bck);
    try {
      await fse.move(targetPath, bck);
    } catch (err) {
      log_err(err);
    }
  }
  
  log(`Copying to: %o...`, targetPath);
  try {
    await fse.copy(sourcePath, targetPath);
  } catch (err) {
    log_err(err);
  }
}




async function initTestHarness () {
  try {
    await fse.ensureDir(paths.TEST_DIR_PATH);
  } catch (err) {
    log_err(`Error checking if %o dir exists!`, paths.TEST_DIR_PATH);
  }
  
  await copy(
      paths.PLUGIN_HARNESS_PATH,
      paths.TEST_DIR_HARNESS_PATH,
      false,
  );
  
  if (prjPkg?.strapi?.kind === 'plugin') {
    await copy(
        paths.PLUGIN_HARNESS_TEST_APP_DIR,
        paths.TEST_APP_DIR,
        false,
    );
    
    await copy(
        paths.PLUGIN_HARNESS_PLUGIN_TESTS_PATH,
        paths.APP_PLUGIN_TEST_PATH,
        false,
    );
  } else {
    try {
      await fse.ensureDir(paths.TEST_ENV_DB_CONFIG_DIR);
    } catch (err) {
      log_err(`Error checking if %o dir exists!`, paths.TEST_ENV_DB_CONFIG_DIR);
    }
    
    await copy(
        paths.PLUGIN_HARNESS_DB_CONFIG_FILE,
        paths.TEST_ENV_DB_CONFIG_FILE,
        true,
    );
    
    await copy(
        paths.PLUGIN_HARNESS_APP_TESTS_PATH,
        paths.APP_TEST_PATH,
        false,
    );
  }
  
  await copy(
      paths.PLUGIN_HARNESS_VITEST_CONFIG_FILE,
      paths.VITEST_CONFIG_FILE,
      false,
  );
  
  const peers = Object.entries(pkg.peerDependencies).map(p => p[0] + '@' + p[1]);
  
  await fse.remove(resolve(paths.TEST_APP_DIR, 'dist')).catch(console.error);
  await fse.remove(resolve(paths.TEST_APP_DIR, '.cache')).catch(console.error);
  await fse.remove(resolve(paths.TEST_APP_DIR, 'node_modules')).catch(console.error);
  
  let pm = packageManager();
  
  if (pm) {
    console.info('\n')
    log('Using %o package manager...', pm);
  } else {
    log_warn(`Couldn't find lock file to determine package manager. Please run install to generate a lock file first. Using npm as a default.`);
    pm = 'npm';
  }
  
  await modifyPackageJsonFile('./package.json', {
    // todo use modify-json-file to add useful package.json devDependencies
    // devDependencies: d => {
    //   console.log(d);
    //   return d;
    // },
    scripts: s => {
      s.test = 'vitest';
      s['vitest:w'] = 'node ./tests/helpers/harness/vitest-watch.js';
      s['vitest:init'] = 'strapi-plugin-vitest-init';
      // test-app: is to make sure we are invoking the correct app
      s['vitest:test-app:clean'] = `cd ${resolve(paths.CWD, 'tests/helpers/harness/test-app')}; rm -rfv dist; rm -fv tsconfig.tsbuildinfo; rm -fv node_modules; rm -rfv .cache &&  echo ' ✨  Done cleaning test-app, run tests, develop, console or start to rebuild ✓'`;
      s['vitest:test-app:develop'] = `cd ${resolve(paths.CWD, 'tests/helpers/harness/test-app')} && ${pm} run test-app:develop`;
      s['vitest:test-app:start'] = `cd ${resolve(paths.CWD, 'tests/helpers/harness/test-app')} && ${pm} run test-app:start`;
      s['vitest:test-app:console'] = `cd ${resolve(paths.CWD, 'tests/helpers/harness/test-app')} && ${pm} run test-app:console`;
      return s;
    },
  });
  
  if (pm === 'pnpm') {
    log_warn(`Please run the following to add packages to your project's %o if you received any messages about missing %o; or configure pnpm to %o to skip the following manual installation.\n\n%o\n`, 'devDependencies', 'peerDependencies', 'auto-install-peers', `pnpm add -D ${peers.join(' ')}`);
  } else {
    log_warn(`Please add the following packages to your project's %o (if you received any messages about missing %o); using:\n\n%o \n`, 'devDependencies', 'peerDependencies', pm === 'npm' ? 'yarn add -D ' + peers.join(' ') : 'npm install -D ' + peers.join(' '));
  }
  
  console.info(`   - If you remove any package from that list be sure to edit the harness, for the ones you remove in %o, where the packages are used.`, './tests/helpers/harness');
}


initTestHarness().then(() => {
  console.info('\n');
  log(`✨ Done initializing ${pkg.name} harness 🚀, read & finish minor required config before use.`);
});
