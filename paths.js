const { existsSync } = require('fs-extra');
const { resolve } = require('path');

const PWD = process.env.PWD;

const PLUGIN_DIR_PATH = __dirname;
const TEST_HARNESS_PATH = resolve(PLUGIN_DIR_PATH, 'harness/tests');
const TEST_DIR_PATH = resolve(PWD, 'tests/');
const isTS = existsSync(resolve(PWD, 'src/'));
const TEST_ENV_DB_CONFIG_DIR = resolve(PWD, `config/env/test/`);
const TEST_ENV_DB_CONFIG_FILE = resolve(TEST_ENV_DB_CONFIG_DIR, `database.${isTS ? 'ts' : 'js'}`);
const TEST_HARNESS_DB_CONFIG_FILE = resolve(PLUGIN_DIR_PATH, `harness/database.${isTS ? 'ts' : 'js'}`);
const TEST_HARNESS_VITEST_CONFIG_FILE = resolve(PLUGIN_DIR_PATH, `harness/vitest.config.js`);
const VITEST_CONFIG_FILE = resolve(PWD, `vitest.config.js`);

const TEST_DIR_HELPERS_PATH = resolve(TEST_DIR_PATH, 'helpers');
const TEST_HARNESS_HELPERS_PATH = resolve(TEST_HARNESS_PATH, 'helpers');
const APP_TEST_HARNESS_PATH = resolve(TEST_HARNESS_PATH, 'app.test.ts');
const APP_TEST_PATH = resolve(TEST_DIR_PATH, 'app.test.ts');

module.exports = {
  PWD, isTS,
  TEST_ENV_DB_CONFIG_DIR,
  TEST_ENV_DB_CONFIG_FILE,
  TEST_HARNESS_PATH,
  TEST_HARNESS_DB_CONFIG_FILE,
  TEST_DIR_PATH,
  PLUGIN_DIR_PATH,
  TEST_HARNESS_VITEST_CONFIG_FILE,
  VITEST_CONFIG_FILE,
  TEST_DIR_HELPERS_PATH,
  TEST_HARNESS_HELPERS_PATH,
  APP_TEST_HARNESS_PATH,
  APP_TEST_PATH,
};
