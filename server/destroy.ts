import type { Strapi } from '@strapi/strapi';

import { uid } from '../pluginId';
import chalk from 'chalk';

export default async ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [destroy/()]-6:} destroying ${uid}...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[uid].config('cleanDBAtDestroy')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
};
