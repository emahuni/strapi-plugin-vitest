import type { Strapi } from '@strapi/strapi';

import pluginId from '../admin/src/pluginId';
import chalk from 'chalk';

export default async ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [destroy/()]-6:} destroying ${pluginId}...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[pluginId].config('cleanDBAtDestroy')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
};
