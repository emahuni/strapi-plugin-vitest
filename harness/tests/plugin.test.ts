import type { Strapi } from '@strapi/strapi';
import { beforeAll, afterAll, it, test, expect, describe } from 'vitest';
// @ts-ignore
import { packageInfo } from './helpers/harness/strapi-test-utils';

const pluingInfo = packageInfo();

describe(`# Plugin "${(pluingInfo.name)}"`, () => {
  /** this code is called once before all tests in this test file are called */
  beforeAll(async () => {
    //
  }, 60000);
  
  /** this code is called once before all tests in this test file are finished */
  afterAll(async () => {
    //
  }, 60000);
  
  
  test('Strapi is defined and ready!', () => {
    expect(strapi).to.not.be.undefined;
  });
  
  test(`"${(pluingInfo.uid)}" is defined and ready!`, () => {
    expect(strapi.plugins[pluingInfo.id]).to.not.be.undefined;
  });
});

// create other test files and don't require them in here, this is a separate standalone test file
// each file will be loaded and can be loaded independently and still work with one Strapi instance
