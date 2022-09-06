import type { Strapi } from '@strapi/strapi';
import { name } from '../../pluginId';
import chalk from 'chalk';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.log.info(chalk`{dim [bootstrap/()]-4:} bootstraping "${name}", ...`);
};


