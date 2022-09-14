import type { Strapi } from '@strapi/strapi';
import chalk from 'chalk';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo(__dirname);

export default function bootstrap ({ strapi }: { strapi: Strapi }) {
  strapi.log.info(chalk`{dim [bootstrap]-4:} bootstraping "${pluginInfo.name}"...`);
}


