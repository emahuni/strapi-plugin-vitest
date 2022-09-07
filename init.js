const fse = require('fs-extra');
const { resolve } = require('path');
const paths = require('./paths.js');

const pkg = JSON.parse(fse.readFileSync(resolve(paths.PLUGIN_DIR_PATH, './package.json'), { encoding: 'utf8' }));


function log (str) {
  console.log(`🧪 [${pkg.name}]: ${str}`);
}


function log_err (str) {
  console.error(`❌ [${pkg.name}]: ${str}`);
}


async function copyIfNotExists (sourcePath, targetPath) {
  let exists;
  try {
    exists = await fse.pathExists(targetPath);
  } catch (err) {
    log_err(`Error checking if "${targetPath}" exists`);
  }

  if (!exists) {
    log(`${targetPath} doesn't exists, adding...`);
    log(`Copying... to: ${targetPath}...`);
    try {
      await fse.copy(sourcePath, targetPath);
    } catch (err) {
      log_err(err);
    }
  } else {
    log(`"${targetPath}" exists, NOT copying.`);
  }
}


async function renameIfExistsAndCopy (sourcePath, targetPath) {
  let exists;
  try {
    exists = await fse.pathExists(targetPath);
  } catch (err) {
    log_err(`Error checking if "${targetPath}" exists`);
  }

  if (!!exists) {
    const bck = targetPath + Date.now();
    log(`"${targetPath}" exists, renaming to "${bck}" so you can migrate any customizations before deleting it...`);
    try {
      await fse.move(targetPath, bck);
    } catch (err) {
      log_err(err);
    }
  }

  log(`Copying to: ${targetPath}...`);
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
    log_err(`Error checking if "${paths.TEST_ENV_DB_CONFIG_DIR}" dir exists!`);
  }

  try {
    await fse.ensureDir(paths.TEST_DIR_PATH);
  } catch (err) {
    log_err(`Error checking if "${paths.TEST_DIR_PATH}" dir exists!`);
  }

  await renameIfExistsAndCopy(
      paths.PLUGIN_HARNESS_PATH,
      paths.TEST_DIR_HARNESS_PATH,
  );

  if (pkg?.strapi?.kind === 'plugin') {
    await renameIfExistsAndCopy(
        paths.PLUGIN_HARNESS_TEST_APP_DIR,
        paths.TEST_APP_DIR,
    );
  }

  await copyIfNotExists(
      paths.PLUGIN_HARNESS_APP_TESTS_PATH,
      paths.APP_TEST_PATH,
  );

  await copyIfNotExists(
      paths.PLUGIN_HARNESS_VITEST_CONFIG_FILE,
      paths.VITEST_CONFIG_FILE,
  );

  await copyIfNotExists(
      paths.PLUGIN_HARNESS_DB_CONFIG_FILE,
      paths.TEST_ENV_DB_CONFIG_FILE,
  );

  const peers = Object.entries(pkg.peerDependencies).map(p => p[0] + '@' + p[1]);

  console.info('\n');
  log(`Please add the following packages to your project's devDependencies if you received any messages about missing peerDependencies.\nIf you use pnpm, configure it to "auto-install-peers" and you won't need to do this manually.\nYou can remove the ones you don't want later, but you should be sure you edit the harness - "./tests/helpers" where the packages are used:\n`);
  console.info('%o', peers.join(' '));
}


initTestHarness().then(() => {
  console.log('\n');
  log(`✨ Done initializing ${pkg.name} harness 🚀, read & finish minor required config before use.`);
});
