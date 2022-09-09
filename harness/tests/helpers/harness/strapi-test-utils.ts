/**
 * Returns valid JWT token for authenticated
 * @param {String | number} idOrEmail, either user id, or email
 */
import type { Strapi } from '@strapi/strapi';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// reliable way to get to a file, especially when using workspaces & pnp modules
import where from 'where-is';

export const info = {
  get packageRootPath () {
    let path, cwd = process.cwd();
    do {
      path = where('package.json', cwd);
      // console.debug(`[strapi-test-utils/packageRootPath()]-17: where is package.json -> path: %o`, path);
      cwd = resolve(cwd, '..'); // step 1 dir back in case we are in test-app directory
    } while (path.includes('test-app')); // just make sure that this is not the test-app package.json's path

    if(!path) throw new Error("Couldn't find package.json that doesn't belong to test-app package.");

    return path;
  },
  get projectPkg () {
    return JSON.parse(readFileSync(resolve(this.packageRootPath, 'package.json'), { encoding: 'utf8' }));
  },
  get pluginName () { return this.projectPkg.name; },
  get pluginId () { return this.pluginName.replace(/^(@.*|strapi-)plugin-/i, ''); },
  get pluginUid () { return `plugin::${this.pluginId}`; },
};


export async function jwt (idOrEmail) {
  return strapi.plugins['users-permissions'].services.jwt.issue({
    [Number.isInteger(idOrEmail) ? 'id' : 'email']: idOrEmail,
  });
}


/**
 * Grants database `permissions` table that role can access an endpoint/controllers
 *
 * @param {int} roleID, 1 Autentihected, 2 Public, etc
 * @param {string} value, in form or dot string eg `"permissions.users-permissions.controllers.auth.changepassword"`
 * @param {boolean} enabled, default true
 * @param {string} policy, default ''
 */
export async function grantPrivilege (
    roleID = 1,
    value,
    enabled = true,
    policy = '',
) {
  const updateObj = value
      .split('.')
      .reduceRight((obj, next) => ({ [next]: obj }), { enabled, policy });

  return await strapi.plugins[
      'users-permissions'
      ].services.userspermissions.updateRole(roleID, updateObj);
}


/** Updates database `permissions` that role can access an endpoint
 * @see grantPrivilege
 */
export async function grantPrivileges (roleID = 1, values = []) {
  await Promise.all(values.map(val => grantPrivilege(roleID, val)));
}


/**
 * Updates the core of strapi
 * @param {*} pluginName
 * @param {*} key
 * @param {*} newValues
 * @param {*} environment
 */
export async function updatePluginStore (
    pluginName,
    key,
    newValues,
    environment = '',
) {
  const pluginStore = strapi.store({
    environment: environment,
    type:        'plugin',
    name:        pluginName,
  });

  const oldValues = await pluginStore.get({ key });
  const newValue = Object.assign({}, oldValues, newValues);

  return pluginStore.set({ key: key, value: newValue });
}


/**
 * Get plugin settings from store
 * @param {*} pluginName
 * @param {*} key
 * @param {*} environment
 */
export function getPluginStore (pluginName, key, environment = '') {
  const pluginStore = strapi.store({
    environment: environment,
    type:        'plugin',
    name:        pluginName,
  });

  return pluginStore.get({ key });
}


/**
 * Check if response error contains error with given ID
 * @param {string} errorId ID of given error
 * @param {object} response Response object from strapi controller
 * @example
 *
 * const response =  {"statusCode":400,"error":"Bad Request","message":[{"messages":[{"id":"Auth.form.error.confirmed","message":"Your account email is not confirmed"}]}],"data":[{"messages":[{"id":"Auth.form.error.confirmed","message":"Your account email is not confirmed"}]}]}
 * responseHasError("Auth.form.error.confirmed", response) // true
 */
export function responseHasError (errorId, response) {
  if (
      response &&
      response.message &&
      Array.isArray(response.message) &&
      response.message.find(
          (entry) =>
              entry.messages &&
              Array.isArray(entry.messages) &&
              entry.messages.find((msg) => msg.id && msg.id === errorId),
      )
  ) {
    return true;
  }
  return false;
}


/**
 * Create a super admin account
 * @param {Strapi} strapi
 * @param {{email?: string, password?: string, whenNone?: boolean}} opts
 * @param opts.email the email to register with
 * @param opts.password the password to use
 * @param opts.whenNone only create the user when there is no admin user
 * @returns {Promise<{jwt: string, user: object}>}
 */
export async function createSuperadminAccount (strapi: Strapi, opts: { email?: string, password?: string, whenNone?: boolean } = {
  email: 'superadmin@test.co.zw', password: 'Password123', whenNone: true,
}): Promise<{ jwt: string, user: object }> {
  // create default super admin for functions that use super admin
  // @ts-expect-error type
  const superAdminRole = await strapi.admin.services.role.getSuperAdmin();
  if (!superAdminRole) {
    throw new Error(
        'Cannot register the first admin because the super admin role doesn\'t exist.',
    );
  }

  // @ts-expect-error type
  const user = await strapi.admin.services.user.create({
    email:             opts.email,
    firstname:         'admin',
    lastname:          'admin',
    password:          opts.password,
    registrationToken: null,
    isActive:          true,
    roles:             superAdminRole ? [superAdminRole.id] : [],
  });

  // @ts-expect-error type
  strapi.superadmin = {
    // @ts-expect-error type
    jwt: strapi.admin.services.token.createJwtToken(user),
    // @ts-expect-error type
    user: strapi.admin.services.user.sanitizeUser(user),
  };

  // @ts-expect-error type
  return strapi.superadmin;
}
