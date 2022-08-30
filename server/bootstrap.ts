import type { Strapi } from '@strapi/strapi';
import pluginId from '../admin/src/pluginId';
import chalk from 'chalk';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [bootstrap/()]-4:} bootstraping ${pluginId}...`);
};
