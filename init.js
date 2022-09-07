const fse = require('fs-extra');
const { resolve } = require('path');
const paths = require('./paths.js');

const pkg = JSON.parse(fse.readFileSync(resolve(paths.PLUGIN_DIR_PATH, './package.json'), { encoding: 'utf8' }));


function log (str, ...rest) {
  console.log(`🛠  [${pkg.name}]: ${str}`, ...rest);
}

function log_warn (str, ...rest) {
  console.warn(`⚠️  [${pkg.name}]: ${str}`, ...rest);
}

function log_err (str, ...rest) {
  console.error(`❌  [${pkg.name}]: ${str}`, ...rest);
}


async function copyIfNotExists (sourcePath, targetPath) {
  let exists;
  try {
    exists = await fse.pathExists(targetPath);
  } catch (err) {
    log_err(`Error checking if %o exists`, targetPath);
  }
  
  if (!exists) {
    log(`%o doesn't exists, adding...`, targetPath);
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
    const bck = targetPath + Date.now();
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
    await fse.ensureDir(paths.TEST_ENV_DB_CONFIG_DIR);
  } catch (err) {
    log_err(`Error checking if %o dir exists!`, paths.TEST_ENV_DB_CONFIG_DIR);
  }
  
  try {
    await fse.ensureDir(paths.TEST_DIR_PATH);
  } catch (err) {
    log_err(`Error checking if %o dir exists!`, paths.TEST_DIR_PATH);
  }
  
  console.info('\n');
  await renameIfExistsAndCopy(
      paths.PLUGIN_HARNESS_PATH,
      paths.TEST_DIR_HARNESS_PATH,
  );
  
  console.info('\n');
  if (pkg?.strapi?.kind === 'plugin') {
    await renameIfExistsAndCopy(
        paths.PLUGIN_HARNESS_TEST_APP_DIR,
        paths.TEST_APP_DIR,
    );
  }
  
  console.info('\n');
  await renameIfExistsAndCopy(
      paths.PLUGIN_HARNESS_APP_TESTS_PATH,
      paths.APP_TEST_PATH,
  );
  
  console.info('\n');
  await renameIfExistsAndCopy(
      paths.PLUGIN_HARNESS_VITEST_CONFIG_FILE,
      paths.VITEST_CONFIG_FILE,
  );
  
  console.info('\n');
  await copyIfNotExists(
      paths.PLUGIN_HARNESS_DB_CONFIG_FILE,
      paths.TEST_ENV_DB_CONFIG_FILE,
  );
  
  const peers = Object.entries(pkg.peerDependencies).map(p => p[0] + '@' + p[1]);
  
  console.info('\n');
  log_warn(`Please add the following packages to your project's devDependencies if you received any messages about missing peerDependencies.\nIf you use pnpm, configure it to "auto-install-peers", run "pnpm install" to install the peers and you won't need to do this manually.\nYou can remove the ones you don't want later, but you should be sure you edit the harness - "./tests/helpers" where the packages are used:\n`);
  console.info('%o', peers.join(' '));
}


initTestHarness().then(() => {
  console.info('\n');
  log(`✨ Done initializing ${pkg.name} harness 🚀, read & finish minor required config before use.`);
});
