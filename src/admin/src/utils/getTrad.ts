import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo(__dirname);

const getTrad = (id: string) => `${pluginInfo.id}.${id}`;

export default getTrad;
