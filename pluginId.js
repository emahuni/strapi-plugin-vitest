const path = require('path');

module.exports.name = path.basename(__dirname);
module.exports.id = module.exports.name.replace(/^(@.*|strapi-)plugin-/i, '');
module.exports.uid = `plugin::${module.exports.id}`;
