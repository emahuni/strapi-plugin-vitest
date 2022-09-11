/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@strapi/helper-plugin';
import HomePage from '../HomePage';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo();

const App: React.VoidFunctionComponent = () => {
  return (
      <div>
        <Switch>
          <Route path={`/plugins/${pluginInfo.id}`} component={HomePage} exact/>
          <Route component={NotFound}/>
        </Switch>
      </div>
  );
};

export default App;
