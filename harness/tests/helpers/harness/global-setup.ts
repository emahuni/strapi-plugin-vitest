import process from 'process';
// @ts-ignore
import { info } from './strapi-test-utils';

// @ts-ignore
import paths = require('strapi-plugin-vitest/paths');

export async function setup () {
  const start = Date.now();
  console.log('globalSetup start');
  
  
  // todo strapi should allow strapi start to accept an appDir, remove this logic when it's done
  if (info.projectPkg?.strapi?.kind === 'plugin') {
    // change to the cwd to the test app's dir so that the app boots up correctly
    // we have to do it here because this doesn't work in workers
    process.chdir(paths.TEST_APP_DIR);
    require('dotenv').config();
  }
  
  // any global setup that needs to happen before running any tests, see vitest documentation https://vitest.dev/config/#globalsetup
  
  const duration = Date.now() - start;
  console.log(`global setup(), took ${(duration)}ms`);
}

export async function teardown () {
  const start = Date.now();
  
  // any global teardown that needs to happen before exiting the whole suite, see vitest documentation https://vitest.dev/config/#globalsetup
  
  const duration = Date.now() - start;
  console.log(`global teardown(), took ${(duration)}ms`);
  if (duration > 4000) throw new Error('error from teardown in globalSetup');
}
