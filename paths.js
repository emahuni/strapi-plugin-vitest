const { existsSync } = require('fs-extra');
const { resolve } = require('path');

const PWD = process.env.PWD;

const PLUGIN_DIR_PATH = __dirname;
const HARNESS_TESTS_PATH = resolve(PLUGIN_DIR_PATH, 'harness/tests');
const TEST_DIR_PATH = resolve(PWD, 'tests/');
const isTS = existsSync(resolve(PWD, 'src/'));
const TEST_ENV_DB_CONFIG_DIR = resolve(PWD, `config/env/test/`);
const TEST_ENV_DB_CONFIG_FILE = resolve(TEST_ENV_DB_CONFIG_DIR, `database.${isTS ? 'ts' : 'js'}`);
const HARNESS_DB_CONFIG_FILE = resolve(PLUGIN_DIR_PATH, `harness/database.${isTS ? 'ts' : 'js'}`);
const HARNESS_VITEST_CONFIG_FILE = resolve(PLUGIN_DIR_PATH, `harness/vitest.config.js`);
const VITEST_CONFIG_FILE = resolve(PWD, `vitest.config.js`);

const TEST_DIR_HARNESS_PATH = resolve(TEST_DIR_PATH, 'helpers/harness');
const HARNESS_PATH = resolve(HARNESS_TESTS_PATH, 'helpers/harness');
const HARNESS_APP_TESTS_PATH = resolve(HARNESS_TESTS_PATH, 'app.test.ts');
const APP_TEST_PATH = resolve(TEST_DIR_PATH, 'app.test.ts');

const TEST_APP_DIR_PATH = resolve(TEST_DIR_HARNESS_PATH, 'test-app');

module.exports = {
  PWD, isTS,
  TEST_ENV_DB_CONFIG_DIR,
  TEST_ENV_DB_CONFIG_FILE,
  HARNESS_TESTS_PATH,
  HARNESS_DB_CONFIG_FILE,
  TEST_DIR_PATH,
  PLUGIN_DIR_PATH,
  HARNESS_VITEST_CONFIG_FILE,
  VITEST_CONFIG_FILE,
  TEST_DIR_HARNESS_PATH,
  HARNESS_PATH,
  HARNESS_APP_TESTS_PATH,
  APP_TEST_PATH,
  TEST_APP_DIR_PATH
};
