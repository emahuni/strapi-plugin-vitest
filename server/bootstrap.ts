import type { Strapi } from '@strapi/strapi';
import pluginId from '../admin/src/pluginId';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(`[bootstrap/()]-4: bootstraping ${pluginId}...`);
};
