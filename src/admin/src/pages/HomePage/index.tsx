/*
 *
 * HomePage
 *
 */

import React from 'react';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo  = packageInfo();

const HomePage: React.VoidFunctionComponent = () => {
  return (
    <div>
      <h1>{pluginInfo.id}&apos;s HomePage</h1>
      <p>Happy coding</p>
    </div>
  );
};

export default HomePage;
