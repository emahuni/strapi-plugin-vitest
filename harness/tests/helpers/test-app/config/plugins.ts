// @ts-ignore
import paths = require('strapi-plugin-vitest/paths');
// @ts-ignore
import { info } from 'strapi-plugin-vitest/dist/strapi-test-utils';

export default ({ env }) => ({
  /** dig out the plugin we are testing */
  [info.pluginId]: {
    enabled: true,
    resolve: info.packageRootPath,
    config:  {
      // if your plugin requires any configuration, then put it here
    },
  },
  // put any additional plugins that your plugin depends on below or above, but don't change the above configuration otherwise the harness will fail.
});
