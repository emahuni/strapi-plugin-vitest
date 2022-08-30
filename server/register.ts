import type { Strapi } from '@strapi/strapi';
import pluginId from '../admin/src/pluginId';
import chalk from 'chalk';

export default async ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [register/()]-6:} registering ${pluginId}...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[pluginId].config('cleanDBAtRegister')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
};
