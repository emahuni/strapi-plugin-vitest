# Strapi plugin Vitest

Strapi plugin creates a Vitest unit testing harness, that loads Strapi in `strapi develop` allowing you to watch for changes and run tests from separate tests files without reloading the singlton. You don't have to require your tests from the `app.test.js` file, each test file is independent of others.


### Details

This plugin provides a Vitest testing harness to enable easier testing with Strapi. The major advantage here is that Vitest uses Vite and therefore takes advantage of modern js
that includes running ESM|TS without any transpilation, which runs the test blazingly fast. Read about [Vitest](https://vitest.dev) & Vite to learn more.

Vitest works with Jest and Chai assertions and is very, very fast with little simple config needed to use it. 

The way this harness is made allows for Strapi to run a singleton that can be used by various files without reloading it each time
for each file; it loads Strapi once, and you just write tests that work in separate isolated files.

### Usage

```sh
yarn add -D strapi-plugin-vitest
```

or

```sh
npm install -D strapi-plugin-vitest
```

### Initialization

To initialize the harness, you need to run the supplied `bin` file:

```sh
yarn vitest-init
# if it fails do:  node ./node_modules/strapi-plugin-vitest/init
```

This custom initialization script will: 
- overwrite any existing harness files in `test/helpers` directory _(ones that it ships with)_ (so make sure you don't have any changes in there that you can't recover)
  This Test harness has added plugins: [expect-more-jest](https://www.npmjs.com/package/expect-more-jest), [jest-extended](https://www.npmjs.com/package/jest-extended), [sinon-chai](https://www.npmjs.com/package/sinon-chai)
  - uses `.env.test`  file to extend the `.env` file if available. This means you can fine-tune the environment for testing purposes, though it maybe for dev purposes as well. I use it to turn on or off certain plugins during testing for example.
- creates a `app.test.ts` example file if missing 
- creates a `vitest.config.js` file if missing 
- creates a `config/env/test/database.(js|ts)` file if missing (review this file, you may not want its defaults. In addition, I have noticed sqlite has issues, you may want to use other DB).

> This command is meant to be run once to expose the testing harness. You can freely edit these files if you wish to customize the harness or add new features through extensions and plugins. However, note that when you run this command again, it will overwrite files as indicated above. You can use VCS to then reset | merge your previous customizations if you so run this command on existing customizations.


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

#### `plugins.js|ts` Modifications

Don't forget to enable the plugin in your test plugins configuration. This plugin also cleans the DB based on configuration during tests startup. We did this to allow you to review your tests data after a run, since you can run a single test.
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
yarn vitest 
```

See [Vitest](https://vitest.dev/) for more information about running tests, arguments and options.

### Difference with Strapi Documentation Example

As mentioned before, this harness allows you to run tests files independently of the `app.test.js` file unlike as documented. Meaning you can run a file directly, without worrying
of how the singleton will mount. Everything will be done by this harness. Test files will NOT be treated as a **single test file**, which makes it easier and standard to test Strapi
code. For example, you can run specific test that match title = `validate my-plugin`, without running other tests:

```sh
yarn test -t "my-plugin"
```

Read Vitest [filtering documentation](https://vitest.dev/guide/filtering.html) for more information.

See example test file `app.test.js`, you can generate other test files like that and just run them as usual, without adding them to a main test file.

### Troubleshooting

#### Tests just quit with exist code 1
- If tests quits with exit code 1, then ensure that sqlite is installed. Check package.json has sqlite3 installed. If not, do `yarn add -D sqlite3`
- To see why it is failing, if no real followable error is showing, run `NODE_ENV=test yarn strapi dev`, that will run in development mode as usual, but with test environment. Any errors being swallowed up by test suite will show up.

#### Watcher is not working
For some reason the vitest watcher is not working with Strapi. Therefore, I have devised a watcher to use with this plugin.
- add `"vitest:w": "node ./tests/helpers/vitest-watch.js",` to you package.json scripts and use it to run under watch mode. Pass other Vitest options as usual.

## Author

Emmanuel Mahuni

### License

MIT
