import fs from 'fs';
import type { Strapi } from '@strapi/strapi';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo(__dirname);

export default function ({ strapi }: { strapi: Strapi }) {
  return {
    cleanDB () {
      strapi.log.info(`[${pluginInfo.id}] Cleaning database...`);
      
      const dbSettings = strapi.config.get('database.connection');
      
      if (dbSettings && dbSettings.filename) {
        strapi.log.debug(`[setup-strapi/cleanupStrapi()]-99: deleting SQLite database file...`);
        const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
        if (fs.existsSync(tmpDbFile)) {
          fs.unlinkSync(tmpDbFile);
        }
      } else {
        // todo implement for other engines
        // await db.dropAllTables({ knex, noInternal: false });
      }
    },
  };
}
