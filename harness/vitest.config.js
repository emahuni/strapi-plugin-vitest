/// <reference types="vitest/dist/index" />
const { defineConfig } = require('vitest/config');

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
      'tests/helpers/global-setup.ts',
    ],
    setupFiles:           [
      'tests/helpers/chai-plugins.ts',
      'tests/helpers/expect-plugins.ts',
      'tests/helpers/setup-strapi.ts',
    ],

    exclude: ['**/strapi-plugin-vitest/harness/**', '**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp,vscode,tmp}/**'],

    forceRerunTriggers: ['**/dist/**', '**/build/**', '**/tests/**', '**/package.json/**', '**/vite.config.*/**', '**/vitest.config.*/**', '.env**', '**/src/**'],
    watchExclude:       ['**/node_modules/**', '**/.{idea,vscode,git,cache,output,temp,tmp}/**', '**/build/**'],
  },
});
