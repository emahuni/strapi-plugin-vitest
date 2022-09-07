import type { Strapi } from '@strapi/strapi';
import { name, id } from '../../pluginId';
import chalk from 'chalk';

export default async ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [destroy/()]-6:} destroying "${name}"...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[id].config('cleanDBAtDestroy')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
};
