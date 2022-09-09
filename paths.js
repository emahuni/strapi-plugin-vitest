const { existsSync } = require('fs-extra');
const { resolve } = require('path');

const CWD = process.cwd();
const PLUGIN_DIR_PATH = __dirname;
const isTS = existsSync(resolve(CWD, 'src/'));

const TEST_DIR_PATH = resolve(CWD, 'tests/');
const PLUGIN_HARNESS_TESTS_PATH = resolve(PLUGIN_DIR_PATH, 'harness/tests');

const TEST_ENV_DB_CONFIG_DIR = resolve(CWD, `config/env/test/`);
const TEST_ENV_DB_CONFIG_FILE = resolve(TEST_ENV_DB_CONFIG_DIR, `database.${isTS ? 'ts' : 'js'}`);
const PLUGIN_HARNESS_DB_CONFIG_FILE = resolve(PLUGIN_DIR_PATH, `harness/database.${isTS ? 'ts' : 'js'}`);

const VITEST_CONFIG_FILE = resolve(CWD, `vitest.config.js`);
const PLUGIN_HARNESS_VITEST_CONFIG_FILE = resolve(PLUGIN_DIR_PATH, `harness/vitest.config.js`);

const TEST_DIR_HARNESS_PATH = resolve(TEST_DIR_PATH, 'helpers/harness');
const APP_TEST_PATH = resolve(TEST_DIR_PATH, 'app.test.ts');
const APP_PLUGIN_TEST_PATH = resolve(TEST_DIR_PATH, 'plugin.test.ts');
const PLUGIN_HARNESS_PATH = resolve(PLUGIN_HARNESS_TESTS_PATH, 'helpers/harness');
const PLUGIN_HARNESS_APP_TESTS_PATH = resolve(PLUGIN_HARNESS_TESTS_PATH, 'app.test.ts');
const PLUGIN_HARNESS_PLUGIN_TESTS_PATH = resolve(PLUGIN_HARNESS_TESTS_PATH, 'plugin.test.ts');

const TEST_APP_DIR = resolve(TEST_DIR_HARNESS_PATH, 'test-app');
const PLUGIN_HARNESS_TEST_APP_DIR = resolve(PLUGIN_HARNESS_TESTS_PATH, 'helpers/test-app');

module.exports = {
  CWD, isTS,
  
  TEST_ENV_DB_CONFIG_DIR,
  TEST_ENV_DB_CONFIG_FILE,
  TEST_DIR_PATH,
  VITEST_CONFIG_FILE,
  TEST_DIR_HARNESS_PATH,
  APP_TEST_PATH,
  APP_PLUGIN_TEST_PATH,
  TEST_APP_DIR,
  
  PLUGIN_HARNESS_TESTS_PATH,
  PLUGIN_HARNESS_DB_CONFIG_FILE,
  PLUGIN_DIR_PATH,
  PLUGIN_HARNESS_VITEST_CONFIG_FILE,
  PLUGIN_HARNESS_PATH,
  PLUGIN_HARNESS_APP_TESTS_PATH,
  PLUGIN_HARNESS_PLUGIN_TESTS_PATH,
  PLUGIN_HARNESS_TEST_APP_DIR
};
