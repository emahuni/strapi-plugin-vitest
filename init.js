const fse = require('fs-extra');
const { resolve } = require('path');
const paths = require('./paths.js');

const pkg = JSON.parse(fse.readFileSync(resolve(paths.PLUGIN_DIR_PATH, './package.json'), { encoding: 'utf8' }));
const prjPkg = JSON.parse(fse.readFileSync(resolve(paths.PWD, './package.json'), { encoding: 'utf8' }));
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

  console.info('\n');
  await copy(
      paths.PLUGIN_HARNESS_PATH,
      paths.TEST_DIR_HARNESS_PATH,
      false,
  );

  if (prjPkg?.strapi?.kind === 'plugin') {
    console.info('\n');
    await copy(
        paths.PLUGIN_HARNESS_TEST_APP_DIR,
        paths.TEST_APP_DIR,
        false,
    );

    console.info('\n');
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

    console.info('\n');
    await copy(
        paths.PLUGIN_HARNESS_DB_CONFIG_FILE,
        paths.TEST_ENV_DB_CONFIG_FILE,
        true,
    );

    console.info('\n');
    await copy(
        paths.PLUGIN_HARNESS_APP_TESTS_PATH,
        paths.APP_TEST_PATH,
        false,
    );
  }

  console.info('\n');
  await copy(
      paths.PLUGIN_HARNESS_VITEST_CONFIG_FILE,
      paths.VITEST_CONFIG_FILE,
      false,
  );

  const peers = Object.entries(pkg.peerDependencies).map(p => p[0] + '@' + p[1]);

  await fse.remove(resolve(paths.TEST_APP_DIR, 'dist')).catch(console.error);
  await fse.remove(resolve(paths.TEST_APP_DIR, '.cache')).catch(console.error);
  await fse.remove(resolve(paths.TEST_APP_DIR, 'node_modules')).catch(console.error);

  console.info('\n');
  log_warn(`Please add the following packages to your project's %o if you received any messages about missing %o;
  using "pnpm/yarn add -D" or "npm install -D" with the following packages appended to that command:
  %o
  
         - If you use pnpm, configure it to %o, and you won't need
           to add these packages manually.
         - If you remove any from that list be sure to edit the harness
           for the ones you remove in %o where the packages are used.
         - Run your package manager installation command:
           %o or %o or %o to install the peers.
`, 'devDependencies', 'peerDependencies', peers.join(' '), 'auto-install-peers', './tests/helpers', 'yarn install', 'npm install', 'pnpm install');
}


initTestHarness().then(() => {
  console.info('\n');
  log(`✨ Done initializing ${pkg.name} harness 🚀, read & finish minor required config before use.`);
});
