const fse = require('fs-extra');
const { resolve } = require('path');
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
    exists = await fse.pathExists(checkIfThisExists);
  } catch (err) {
    log_err(`Error checking if "${checkIfThisExists}" exists`);
  }
  
  if (!exists) {
    log(`${checkIfThisExists} doesn't exists, adding...`);
    log(`Copying... to: ${targetPath}...`);
    try {
      await fse.copy(sourcePath, targetPath);
    } catch (err) {
      log_err(err);
    }
  } else {
    log(`"${checkIfThisExists}" exists, NOT copying.`);
  }
}




async function initTestHarness () {
  log(`Copying & overwritting testing harness helpers: \n\t-to: ${paths.TEST_DIR_HELPERS_PATH}\n`);
  await fse.copy(paths.TEST_HARNESS_HELPERS_PATH, paths.TEST_DIR_HELPERS_PATH);
  
  await checkIfExistsAndCopy(
      paths.APP_TEST_PATH,
      paths.APP_TEST_HARNESS_PATH,
      paths.APP_TEST_PATH,
  );
  
  try {
    await fse.ensureDir(paths.TEST_ENV_DB_CONFIG_DIR);
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
  
  const pkg = JSON.parse(fse.readFileSync(resolve(paths.PLUGIN_DIR_PATH, './package.json'), { encoding: 'utf8' }));
  const peers = Object.entries(pkg.devDependencies).map(p => p[0] + '@' + p[1]);
  
  log(`Please add the following packages to your project's devDependencies (you can remove the ones you don't want later, but you should be sure you edit the harness - "./tests/helpers" where the packages are used):\n`);
  console.info('%o',peers.join(' '));
}


initTestHarness().then(() => {
  console.log('\n');
  log('✨Done initializing test harness 🚀, read & finish minor required config before use.');
});
