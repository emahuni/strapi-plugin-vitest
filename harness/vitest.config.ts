/// <reference types="vitest/dist/index" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // no threads, since we have a singleton instance that we need to use everywhere besides the DB content being shared
    threads:              false,
    reporters:            'verbose',
    outputTruncateLength: 200,
    passWithNoTests:      false,
    allowOnly:            true,
    globalSetup:          [
      'tests/helpers/global-setup.ts',
    ],
    setupFiles:           [
      'tests/helpers/chai-plugins.ts',
      'tests/helpers/expect-plugins.ts',
      'tests/helpers/setup-strapi.ts',
    ],
  },
});
