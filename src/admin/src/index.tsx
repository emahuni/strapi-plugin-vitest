import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo(__dirname);

export default {
  register (app) {
    app.addMenuLink({
      to:          `/plugins/${pluginInfo.id}`,
      icon:        PluginIcon,
      intlLabel:   {
        id:             `${pluginInfo.id}.plugin.name`,
        defaultMessage: pluginInfo.name,
      },
      Component:   async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');
        
        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    const plugin = {
      id:          pluginInfo.id,
      initializer: Initializer,
      isReady:     false,
      name:        pluginInfo.name,
    };
    
    app.registerPlugin(plugin);
  },
  
  bootstrap (app) {},
  async registerTrads (app) {
    const { locales } = app;
    
    const importedTrads = await Promise.all(
        locales.map(locale => {
          return import(`./translations/${locale}.json`)
              .then(({ default: data }) => {
                return {
                  data: prefixPluginTranslations(data, pluginInfo.id),
                  locale,
                };
              })
              .catch(() => {
                return {
                  data: {},
                  locale,
                };
              });
        }),
    );
    
    return Promise.resolve(importedTrads);
  },
};
