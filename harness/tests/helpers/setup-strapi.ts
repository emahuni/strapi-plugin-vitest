import envOverride from './env-override';

import { afterAll, beforeAll } from 'vitest';

import StrapiStart from '@strapi/strapi/lib/commands/start';
import { createSuperadminAccount } from './strapi-test-utils';

beforeAll(async (ctx) => {
  if (typeof global.contexts === 'undefined') {
    global.contexts = [ctx];
  } else {
    // todo workaround for https://github.com/vitest-dev/vitest/issues/1926
    global.contexts.push(ctx);
  }

  // console.debug(`[setup-strapi/beforeAll()()]-13: context: %o`, global.contexts.length);

  if (!global.strapiBooted) {
    global.strapiBooted = true;

    envOverride({ envFile: '.env.test' });

    /**
     * strapi-plugin-vitest will drop all (non-SQLite DB) tables before Strapi uses it so that it starts on a blank slate
     * this is because we don't want to re-create the DB we may not have permission to do so.
     * - configure this in plugin configuration
     **/
    const strapi = await StrapiStart({});
    if (!!strapi) {
      strapi.log.info('Strapi started successfully 🚀');
      // console.debug(`[server/()]-11: strapi: %o`, strapi.db.connection.client.config);

      // by default, it creates the admin only when there are no accounts in the DB.
      await createSuperadminAccount(strapi);

      // vitest will create an afterAll hook;
      return cleanupStrapi; // todo this is a bug workaround, afterAll will not fire for the last suite if missing, neither will it if afterAll is missing.
    } else {
      throw new Error(`[setup-strapi/beforeAll()]-39: ❌ failed to start Strapi!`);
    }
  }
}, 60000);


afterAll(async (ctx) => {
  /** check if this is the last test suite */
  if (global.__vitest_worker__.ctx.files.length <= global.contexts.length) {
    // @ts-expect-error type
    const strapi: typeof StrapiStart = global.strapi;
    await strapi.destroy();
    global.strapiBooted = false;
    global.contexts = [];
  }
});


async function cleanupStrapi () {
  // console.debug(`[setup-strapi/cleanupStrapi()]-34: cleaning up strapi...`);
  // console.debug(`[setup-strapi/cleanupStrapi()()]-53: global.__metadata: %o`, /*_.keys*/(global.__metadata));
  // console.debug(`[setup-strapi/cleanupStrapi()()]-53: global.__vitest_worker__: %o`, _.keys(global.__vitest_worker__));
  // console.debug(`[setup-strapi/cleanupStrapi()()]-53: global.__vitest_worker__.ctx: %o`, _.keys(global.__vitest_worker__.ctx));
  // console.debug(`[setup-strapi/cleanupStrapi()()]-53: global.__vitest_worker__.ctx.workerId: %o`, /*_.keys*/(global.__vitest_worker__.ctx.workerId));
  // console.debug(`[setup-strapi/cleanupStrapi()()]-53: global.__vitest_worker__.ctx.files: %o`, (global.__vitest_worker__.ctx.files));
}
