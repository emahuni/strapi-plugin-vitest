# Strapi plugin Vitest

> Strapi plugin creates a Vitest unit testing harness, that can be used to test Strapi apps and standalone plugins. It loads Strapi as a singleton that can be used by multiple independent test files. It can also be used in watch mode.

> Plugin still < v1.0.0, implementations may change.

## Details

This plugin provides a Vitest testing harness to enable easier testing with Strapi. The major advantage here is that Vitest uses Vite and therefore takes advantage of modern js
that includes running ESM or TS without any transpilation. Read about [Vitest](https://vitest.dev) & Vite to learn more. Vitest works with Jest and Chai assertions and is very, very fast with little simple config needed to use it. 

The way this harness is made allows for Strapi to run a singleton that can be used by various test files without reloading it each time
for each file; it loads Strapi once, and you just write tests that work in independent test files without appending them to `app.test.js`.

In addition to testing Strapi applications, it can also be used to test standalone plugins. It has a mini-strapi app that is exposed when you install and initialize it into a plugin project. The mini-app is started and has the root package (plugin) installed by default. You can then customize the mini-app  `tests/helpers/harness/test-app` for anything required by the plugin.

## Usage

```sh
pnpm add -D strapi-plugin-vitest
```

Use your preferred package manager `yarn/pnpm/npm` where `pnpm` is mentioned.

### Initialization

To initialize the harness, you need to run `pnpm vitest-init` 

> This command is meant to be run once to expose the testing harness. However, you can run it any time to get the fresh/updated harness, and it will overwrite any existing harness files (VCS is essential here). You can freely edit these files if you wish to customize the harness or add new features through extensions and plugins. You can migrate your previous customizations through VCS diffs if you so run this command on existing customizations.


The initialization script: 
- _**creates/overwrites**_ any existing harness files/dirs in `test/helpers` directory _(ones that it ships with)_.
  This Test harness has added plugins: [expect-more-jest](https://www.npmjs.com/package/expect-more-jest), [jest-extended](https://www.npmjs.com/package/jest-extended), [sinon-chai](https://www.npmjs.com/package/sinon-chai)
  - uses `.env.test`  file to extend the `.env` file if available. This means you can fine-tune any existing environments for testing purposes. I use it to turn on or off certain plugins during testing, for example.
- _**creates/overwrites**_ `app.test.ts` or `plugin.test.ts` example file (respective if it is installed in a Strapi app/plugin) 
- _**creates/overwrites**_ `vitest.config.js` vitest configuration file
- _**creates**_ a `config/env/test/database.(js|ts)` file if missing
- _**adds**_ the following scripts to your `package.json` assist with initialization, usage and other chores _(please review them for correctness)_:
  - `vitest:w` - executes script to run vitest in watch mode (custom watcher)
  - `vitest:test-app:clean` - executes script to clean test application build artifacts (only available with plugins)
  - `vitest:test-app:develop` - executes script to run the test application in develop mode (only available with plugins)
  - `vitest:test-app:start` - executes script to run the test application in start mode (only available with plugins)
  - `vitest:test-app:console` - executes script to run the test application in console mode (only available with plugins)
  - `vitest:test-app:diag` - executes script to run the test application in start mode, but in a test environment to allow you to diagnose problems. See troubleshooting for more information.
  - `vitest:diag` - executes script to run your application in start mode, but in a test environment to allow you to diagnose problems. See troubleshooting for more information.
  - `vitest:devDeps` - executes script to install required dev-dependencies, just run it after every init. You can edit or remove this script once you are done with it.
  - `vitest:deps` - same as above but for dependencies (will only update any packages you moved to dependencies if applicable)
- tells you important dependencies that you must install inorder to use the harness.

### Configuration

#### `tsconfig.config` Modifications
Create or add the following into `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "@strapi/strapi",
      "vitest/globals",
      "./schemas"
    ]
  }
}
```

#### `plugins.js|ts` Configuration

Enable the plugin in your test plugins' configuration - for applications testing only.

This plugin also cleans the DB based on configuration during tests startup/destroy.
  - At Register is meant to allow you to review your tests data after each run.
  - At Destroy is meant to be used to just clean up the database after each run.

```js
module.exports = {
  vitest: {
    enabled: true, 
    config: {
      cleanDBAtRegister: Boolean, // use either to clean DB before or after strapi server register and destroy
      cleanDBAtDestroy: Boolean,
    }
  }
}
```

### Running tests

To run tests do the following:

```sh
pnpm vitest 
```

See [Vitest](https://vitest.dev/) for more information about running tests, arguments and options.

### Difference with Strapi Unit Testing Guide Documentation

As mentioned before, this harness allows you to run tests files independent of the `app.test.js` file, you can even delete this file, it's just there as a sample; unlike as [documented](https://docs.strapi.io/developer-docs/latest/guides/unit-testing.html) by Strapi. (Strapi Team is free to add this package to Strapi Documentation or to Strapi suite of packages). Meaning you can run a file directly, without worrying
of how the singleton will mount. Everything will be done by this harness, making it easier and standard to test Strapi
code. For example, you can run specific test that match title = `# validate my-service`, without running other tests:

```sh
pnpm test -t "my-service"
```

Read Vitest [filtering documentation](https://vitest.dev/guide/filtering.html) for more information on tests filtering.

See example test file `app.test.ts`/`plugin.test.ts`, you can generate other similar test files and just run them as usual, without adding them to any main test file or worry about special treatment for test code.

### Troubleshooting

#### Tests just quit with exist code 1

- If tests quits with errors or not, first ensure all required plugin dependencies were installed before using this harness. You can quickly do so by running the added script `pnpm vitest:devDeps` and `pnpm vitest:deps` (if available), you can remove the scripts once you are done with them.
- Sometimes it may not be clear why the harness is failing to start. To see why startup is failing, if no real followable error is showing:
  - when strapi-plugin-vitest is used to test **applications** run `pnpm vitest:diag` which does `NODE_ENV=test pnpm strapi start` 
  - when strapi-plugin-vitest is used to test **plugins** run `pnpm vitest:test-app:diag` which does `NODE_ENV=test pnpm vitest:test-app:start` 
  
  either commands (for applications or plugins) will run Strapi as usual, but within a test environment. **Any errors being swallowed up by test suite will be thrown**.

#### Tests Watching

For some reason the vitest watcher is not working with Strapi. Therefore, I devised a watcher to use with this plugin.
- run `vitest-watch` or `vitest:w` to run under watch mode. Pass other Vitest arguments as required.

### Noteworthy Changes

#### v0.2.7

- cleaned up the harness' dependencies and usage.

#### v0.2.6

- added scripts to make things easier 
- fixed a few bugs

#### v0.2.5

- Fixed usage of plugin by the test-app.
- Reverted to earlier behaviour of overwriting existing harness files. Commit everything before running init. 

#### v0.2.2

- Harness has a few fixes, therefore you need to run `vitest-init` to get the latest version of the harness. You don't have to back up any files, it'll be done for you.
- The new harness can now be used to test standalone plugins


#### v0.2.0

- Harness has a few fixes, therefore you need to run `vitest-init` to get the latest version of the harness. Before you do, rename `vitest-config.js` to `vitest-config.bck.js`, if you have any changes, move them into the new `vitest-config.js`.
- Once you re-init harness, note that it is now in `tests/helpers/harness` from `tests/helpers`. If you have any customizations in the old harness files, then you have to manually move any customizations into the new files before you delete the old files.


## Author

Emmanuel Mahuni

### License

MIT
