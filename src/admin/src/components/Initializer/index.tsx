/**
 *
 * Initializer
 *
 */

import React, { useEffect, useRef } from 'react';
import { packageInfo } from '@emanimation/strapi-utils';

const pluginInfo = packageInfo(__dirname);

type InitializerProps = {
  setPlugin: (id: string) => void;
};

const Initializer: React.FC<InitializerProps> = ({ setPlugin }) => {
  const ref = useRef<(id: string) => void | null>(null);
  ref.current = setPlugin;
  
  useEffect(() => {
    ref.current(pluginInfo.id);
  }, []);
  
  return null;
};

export default Initializer;
