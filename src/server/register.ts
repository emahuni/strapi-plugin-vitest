import type { Strapi } from '@strapi/strapi';
import chalk from 'chalk';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo();

export default async function register ({ strapi }: { strapi: Strapi }) {
  strapi.log.info(chalk`{dim [register]-6:} registering "${pluginInfo.name}"...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[pluginInfo.id].config('cleanDBAtRegister')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
}
