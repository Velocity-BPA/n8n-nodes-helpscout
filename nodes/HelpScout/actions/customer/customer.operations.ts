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
import { buildQueryParams, cleanObject, toExecutionData } from '../../utils/helpers';

/**
 * Create a new customer
 */
export async function createCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const firstName = this.getNodeParameter('firstName', index) as string;
  const lastName = this.getNodeParameter('lastName', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    firstName,
    lastName,
  };

  if (additionalFields.email) {
    body.emails = [
      {
        type: additionalFields.emailType || 'work',
        value: additionalFields.email,
      },
    ];
  }

  if (additionalFields.phone) {
    body.phones = [
      {
        type: additionalFields.phoneType || 'work',
        value: additionalFields.phone,
      },
    ];
  }

  if (additionalFields.jobTitle) {
    body.jobTitle = additionalFields.jobTitle;
  }

  if (additionalFields.organization) {
    body.organization = additionalFields.organization;
  }

  if (additionalFields.background) {
    body.background = additionalFields.background;
  }

  if (additionalFields.gender) {
    body.gender = additionalFields.gender;
  }

  if (additionalFields.age) {
    body.age = additionalFields.age;
  }

  if (additionalFields.location) {
    body.location = additionalFields.location;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    '/customers',
    cleanObject(body),
  );

  return toExecutionData(response);
}

/**
 * Get a customer by ID
 */
export async function getCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as number;

  const response = await helpScoutApiRequest.call(this, 'GET', `/customers/${customerId}`);

  return toExecutionData(response);
}

/**
 * Get all customers
 */
export async function getAllCustomers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const query = buildQueryParams(filters);

  if (returnAll) {
    const customers = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      '/customers',
      {},
      query,
      'customers',
    );
    return toExecutionData(customers);
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.pageSize = Math.min(limit, 50);

  const response = await helpScoutApiRequest.call(this, 'GET', '/customers', {}, query);

  let customers: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).customers) {
    customers = (response._embedded as IDataObject).customers as IDataObject[];
  }

  return toExecutionData(customers.slice(0, limit));
}

/**
 * Update a customer
 */
export async function updateCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as number;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.firstName) {
    body.firstName = updateFields.firstName;
  }

  if (updateFields.lastName) {
    body.lastName = updateFields.lastName;
  }

  if (updateFields.jobTitle) {
    body.jobTitle = updateFields.jobTitle;
  }

  if (updateFields.organization) {
    body.organization = updateFields.organization;
  }

  if (updateFields.background) {
    body.background = updateFields.background;
  }

  if (updateFields.gender) {
    body.gender = updateFields.gender;
  }

  if (updateFields.age) {
    body.age = updateFields.age;
  }

  if (updateFields.location) {
    body.location = updateFields.location;
  }

  await helpScoutApiRequest.call(
    this,
    'PUT',
    `/customers/${customerId}`,
    cleanObject(body),
  );

  // Return the updated customer
  return getCustomer.call(this, index);
}

/**
 * Delete a customer
 */
export async function deleteCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as number;

  await helpScoutApiRequest.call(this, 'DELETE', `/customers/${customerId}`);

  return toExecutionData({ success: true, customerId });
}

/**
 * Get customer conversations
 */
export async function getCustomerConversations(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as number;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const conversations = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      `/customers/${customerId}/conversations`,
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
    `/customers/${customerId}/conversations`,
    {},
    { pageSize: Math.min(limit, 50) },
  );

  let conversations: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).conversations) {
    conversations = (response._embedded as IDataObject).conversations as IDataObject[];
  }

  return toExecutionData(conversations.slice(0, limit));
}
