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
import { cleanObject, generateWebhookSecret, toExecutionData } from '../../utils/helpers';

/**
 * Create a new webhook
 */
export async function createWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const url = this.getNodeParameter('url', index) as string;
  const events = this.getNodeParameter('events', index) as string[];
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    url,
    events,
    secret: additionalFields.secret || generateWebhookSecret(),
    payloadVersion: additionalFields.payloadVersion || 'v2',
  };

  if (additionalFields.label) {
    body.label = additionalFields.label;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    '/webhooks',
    cleanObject(body),
  );

  return toExecutionData(response);
}

/**
 * Get all webhooks
 */
export async function getAllWebhooks(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const webhooks = await helpScoutApiRequestAllItems.call(
    this,
    'GET',
    '/webhooks',
    {},
    {},
    'webhooks',
  );

  return toExecutionData(webhooks);
}

/**
 * Update a webhook
 */
export async function updateWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as number;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.url) {
    body.url = updateFields.url;
  }

  if (updateFields.events) {
    body.events = updateFields.events;
  }

  if (updateFields.secret) {
    body.secret = updateFields.secret;
  }

  if (updateFields.payloadVersion) {
    body.payloadVersion = updateFields.payloadVersion;
  }

  if (updateFields.label) {
    body.label = updateFields.label;
  }

  if (updateFields.state) {
    body.state = updateFields.state;
  }

  await helpScoutApiRequest.call(
    this,
    'PUT',
    `/webhooks/${webhookId}`,
    cleanObject(body),
  );

  return toExecutionData({ success: true, webhookId });
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as number;

  await helpScoutApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);

  return toExecutionData({ success: true, webhookId });
}
