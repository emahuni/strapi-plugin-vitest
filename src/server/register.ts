import type { Strapi } from '@strapi/strapi';
import { name, id } from '../../pluginId';
import chalk from 'chalk';

export default async ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [register/()]-6:} registering "${name}"...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[id].config('cleanDBAtRegister')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
};
