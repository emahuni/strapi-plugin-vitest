// @ts-ignore
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo();

export default ({ env }) => ({
  /** dig out the plugin we are testing */
  [pluginInfo.id]: {
    enabled: true,
    resolve: pluginInfo.rootPath,
    config:  {
      // if your plugin requires any configuration, then put it here
    },
  },
  // put any additional plugins that your plugin depends on below or above, but don't change the above configuration otherwise the harness will fail.
});
