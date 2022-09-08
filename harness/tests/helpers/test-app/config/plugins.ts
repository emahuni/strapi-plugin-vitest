// @ts-ignore
import paths = require('strapi-plugin-vitest/paths');
import { readFileSync } from 'fs';
import { resolve } from 'path';

// the following path is relative to the dist/config directory not this directory, ts will compile it and mess paths 🤦🏽‍♂️
const resolvedPath = resolve(__dirname, '../../../../../..');
const resolvedPackageJsonPath = resolve(resolvedPath, 'package.json');
// console.debug(`[plugins/()]-8: __dirname: %o, resolvedPath: %o, resolvedPackageJsonPath: %o`, __dirname, resolvedPath, resolvedPackageJsonPath);
export const projectPkg = JSON.parse(readFileSync(resolvedPackageJsonPath, { encoding: 'utf8' }));
// console.debug(`[plugins/()]-4: projectPkg`, projectPkg);
// console.debug(`[plugins/()]-9: paths.PWD: %o\nprocess.cwd(): %o`, paths.PWD, process.cwd());

export default ({ env }) => ({
  /** dig out the plugin we are testing */
  [projectPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '')]: {
    enabled: true,
    resolve: resolvedPath,
    config:  {
      // if your plugin requires any configuration, then put it here
    },
  },
  // put any additional plugins that your plugin depends on below or above, but don't change the above configuration otherwise the harness will fail.
});
