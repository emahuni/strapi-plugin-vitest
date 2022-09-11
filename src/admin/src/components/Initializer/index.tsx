/**
 *
 * Initializer
 *
 */

import React, { useEffect, useRef } from 'react';
// @ts-expect-error
import { packageInfo } from './dist/strapi-test-utils';

const pluginInfo = packageInfo();

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
