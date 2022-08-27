import type { Strapi } from '@strapi/strapi';
import pluginId from '../admin/src/pluginId';

export default async ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(`[register/()]-6: registering ${pluginId}...`);
  if (process.env.NODE_ENV === 'test') {
    if (strapi.plugins[pluginId].config('cleanDBAtRegister')) {
      await strapi.services['plugin::vitest.utils'].cleanDB();
    }
  }
};
