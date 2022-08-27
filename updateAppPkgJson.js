const fs = require('fs');
const { resolve } = require('path');

const { PWD, PLUGIN_DIR_PATH } = require('./paths.js');

console.debug(`[install/()]-6: PWD: %o, PLUGIN_DIR_PATH: %o`, PWD, PLUGIN_DIR_PATH);

const fileName = resolve(PWD, 'package.json');
if (!fs.existsSync(fileName)) {
  console.error('[strapi-plugin-vitest] Error creation script section in package.json, package.json not found.');
} else {
  let pkg = fs.readFileSync(fileName, { encoding: 'utf8' });
  if (!!pkg) {
    pkg = JSON.parse(pkg);

    if (!pkg.scripts) {
      // noinspection JSPrimitiveTypeWrapperUsage
      pkg.scripts = {};
    }

    pkg.scripts['vitest:init'] = `node ${PLUGIN_DIR_PATH}/init.js`;
    pkg.scripts['test'] = `vitest --run`;

    pkg = jsonFormat(JSON.stringify(pkg), { type: 'space', size: 2 })

    fs.writeFile(fileName, pkg, function writeJSON (err) {
      if (err) return console.log(err);
      console.log('Updated  ' + fileName + ' with testing scripts 🚀');
    });
  } else {
    console.error('[strapi-plugin-vitest] Error reading package.json: ' + fileName);
  }
}
