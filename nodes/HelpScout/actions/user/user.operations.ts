/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  helpScoutApiRequest,
  helpScoutApiRequestAllItems,
} from '../../transport/HelpScoutClient';
import { buildQueryParams, toExecutionData } from '../../utils/helpers';

/**
 * Get a user by ID
 */
export async function getUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as number;

  const response = await helpScoutApiRequest.call(this, 'GET', `/users/${userId}`);

  return toExecutionData(response);
}

/**
 * Get all users
 */
export async function getAllUsers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const query = buildQueryParams(filters);

  if (returnAll) {
    const users = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      '/users',
      {},
      query,
      'users',
    );
    return toExecutionData(users);
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.pageSize = Math.min(limit, 50);

  const response = await helpScoutApiRequest.call(this, 'GET', '/users', {}, query);

  let users: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).users) {
    users = (response._embedded as IDataObject).users as IDataObject[];
  }

  return toExecutionData(users.slice(0, limit));
}

/**
 * Get authenticated user (resource owner)
 */
export async function getResourceOwner(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await helpScoutApiRequest.call(this, 'GET', '/users/me');

  return toExecutionData(response);
}
