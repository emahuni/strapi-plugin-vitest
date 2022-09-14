import type { Strapi } from '@strapi/strapi';
import chalk from 'chalk';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo(__dirname);

export default async function destroy ({ strapi }: { strapi: Strapi }) {
  strapi.log.info(chalk`{dim [destroy]-6:} destroying "${pluginInfo.name}"...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[pluginInfo.id].config('cleanDBAtDestroy')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
}
