import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { omitBy } from 'lodash'
import dotenv from 'dotenv'; // there is a caveat on using dotenv with import, read the readme file

export default function overrideEnv ({ envFile = '.env.test' } = {}) {
  const testEnvFile = resolve(process.cwd(), envFile);
  if (existsSync(testEnvFile)) {
    const envConfig = dotenv.parse(readFileSync(testEnvFile));
    console.info(`[envOverride] Overriding env configuration with ".env.test" config envConfig: %o`, omitBy(envConfig, (v, k) => !!process.env[`__${k}`]));
    // console.debug(`[envOverride]-13: envConfig: %o, process.env: %o`, envConfig, process.env);
    for (const k in envConfig) {
      if (!process.env[`__${k}`]) process.env[k] = envConfig[k];
    }
    // console.debug(`[envOverride]-17: final process.env: %o`, process.env);
  }
}
