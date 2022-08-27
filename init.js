const fs = require('fs-extra');

const paths = require('./paths.js');


function log (str) {
  console.log('🧪 [strapi-plugin-vitest]: ' + str);
}


function log_err (str) {
  console.error('❌ [strapi-plugin-vitest]: ' + str);
}


async function checkIfExistsAndCopy (checkIfThisExists, sourcePath, targetPath) {
  let exists;
  try {
    exists = await fs.pathExists(checkIfThisExists);
  } catch (err) {
    log_err(`Error checking if "${checkIfThisExists}" exists`);
  }

  if (!exists) {
    log(`${checkIfThisExists} doesn't exists, adding...`);
    log(`Copying... to: ${targetPath}...`);
    try {
      await fs.copy(sourcePath, targetPath);
    } catch (err) {
      log_err(err);
    }
  } else {
    log(`"${checkIfThisExists}" exists, NOT copying.`);
  }
}




async function initTestHarness () {
  log(`Copying & overwritting testing harness helpers: \n\t-to: ${paths.TEST_DIR_HELPERS_PATH}\n`);
  await fs.copy(  paths.TEST_HARNESS_HELPERS_PATH, paths.TEST_DIR_HELPERS_PATH);

  await checkIfExistsAndCopy(
    paths.APP_TEST_PATH,
    paths.APP_TEST_HARNESS_PATH,
    paths.APP_TEST_PATH,
  );

  try {
    await fs.ensureDir(paths.TEST_ENV_DB_CONFIG_DIR);
  } catch (err) {
    log_err(`Error checking if "${paths.TEST_ENV_DB_CONFIG_DIR}" dir exists!`);
  }

  await checkIfExistsAndCopy(
    paths.VITEST_CONFIG_FILE,
    paths.TEST_HARNESS_VITEST_CONFIG_FILE,
    paths.VITEST_CONFIG_FILE,
  );

  await checkIfExistsAndCopy(
    paths.TEST_ENV_DB_CONFIG_FILE,
    paths.TEST_HARNESS_DB_CONFIG_FILE,
    paths.TEST_ENV_DB_CONFIG_FILE,
  );
}


initTestHarness().then(() => {
  console.log('\n')
  log('✨Done initializing test harness 🚀, read & finish minor required config before use.');
});
