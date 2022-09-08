/// <reference types="vitest/dist/index" />
const { defineConfig } = require('vitest/config');
const paths = require('strapi-plugin-vitest/paths');
const { join } = require('path');

module.exports = defineConfig({
  test: {
    globals: true,
    watch:   false,
    // no threads, since we have a singleton instance that we need to use everywhere besides the DB content being shared
    threads:              false,
    reporters:            'verbose',
    outputTruncateLength: 200,
    passWithNoTests:      false,
    allowOnly:            true,
    teardownTimeout:      4000,
    globalSetup:          [
      join(paths.TEST_DIR_HARNESS_PATH, 'global-setup.ts'),
    ],
    setupFiles:           [
      join(paths.TEST_DIR_HARNESS_PATH, 'chai-plugins.ts'),
      join(paths.TEST_DIR_HARNESS_PATH, 'expect-plugins.ts'),
      join(paths.TEST_DIR_HARNESS_PATH, 'setup-strapi.ts'),
    ],
    
    exclude: ['**/strapi-plugin-vitest/harness/**', '**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp,vscode,tmp}/**', 'tests/helpers/**'],
    
    forceRerunTriggers: ['**/dist/**', '**/build/**', '**/tests/**', '**/package.json/**', '**/vite.config.*/**', '**/vitest.config.*/**', '.env**', '**/src/**'],
    watchExclude:       ['**/node_modules/**', '**/.{idea,vscode,git,cache,output,temp,tmp}/**', '**/build/**'],
  },
});
