export async function setup () {
  const start = Date.now();
  console.log('globalSetup start');

  // any global setup that needs to happen before runnning any tests, see vitest documentation https://vitest.dev/config/#globalsetup

  const duration = Date.now() - start;
  console.log(`global setup(), took ${(duration)}ms`);
}

export async function teardown () {
  const start = Date.now();

  // any global teardown that needs to happen before exiting the whole suite, see vitest documentation https://vitest.dev/config/#globalsetup

  const duration = Date.now() - start;
  console.log(`global teardown(), took ${(duration)}ms`);
  if (duration > 4000) throw new Error('error from teardown in globalSetup');
}
