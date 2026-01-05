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
import { cleanObject, toExecutionData } from '../../utils/helpers';

/**
 * Create a new organization
 */
export async function createOrganization(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    name,
  };

  if (additionalFields.domain) {
    body.domain = additionalFields.domain;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    '/organizations',
    cleanObject(body),
  );

  return toExecutionData(response);
}

/**
 * Get an organization by ID
 */
export async function getOrganization(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as number;

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    `/organizations/${organizationId}`,
  );

  return toExecutionData(response);
}

/**
 * Get all organizations
 */
export async function getAllOrganizations(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const organizations = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      '/organizations',
      {},
      {},
      'organizations',
    );
    return toExecutionData(organizations);
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/organizations',
    {},
    { pageSize: Math.min(limit, 50) },
  );

  let organizations: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).organizations) {
    organizations = (response._embedded as IDataObject).organizations as IDataObject[];
  }

  return toExecutionData(organizations.slice(0, limit));
}

/**
 * Update an organization
 */
export async function updateOrganization(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as number;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.name) {
    body.name = updateFields.name;
  }

  if (updateFields.domain) {
    body.domain = updateFields.domain;
  }

  await helpScoutApiRequest.call(
    this,
    'PUT',
    `/organizations/${organizationId}`,
    cleanObject(body),
  );

  // Return the updated organization
  return getOrganization.call(this, index);
}

/**
 * Delete an organization
 */
export async function deleteOrganization(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as number;

  await helpScoutApiRequest.call(this, 'DELETE', `/organizations/${organizationId}`);

  return toExecutionData({ success: true, organizationId });
}

/**
 * Get organization conversations
 */
export async function getOrganizationConversations(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as number;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const conversations = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      `/organizations/${organizationId}/conversations`,
      {},
      {},
      'conversations',
    );
    return toExecutionData(conversations);
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    `/organizations/${organizationId}/conversations`,
    {},
    { pageSize: Math.min(limit, 50) },
  );

  let conversations: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).conversations) {
    conversations = (response._embedded as IDataObject).conversations as IDataObject[];
  }

  return toExecutionData(conversations.slice(0, limit));
}
