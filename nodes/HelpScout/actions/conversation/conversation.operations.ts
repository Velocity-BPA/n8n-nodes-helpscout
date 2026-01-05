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
 * Create a new conversation
 */
export async function createConversation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const mailboxId = this.getNodeParameter('mailboxId', index) as number;
  const subject = this.getNodeParameter('subject', index) as string;
  const customerEmail = this.getNodeParameter('customerEmail', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    type: additionalFields.type || 'email',
    mailboxId,
    subject,
    customer: {
      email: customerEmail,
    },
    threads: [
      {
        type: 'customer',
        customer: {
          email: customerEmail,
        },
        text: additionalFields.text || '',
      },
    ],
  };

  if (additionalFields.status) {
    body.status = additionalFields.status;
  }

  if (additionalFields.assignTo) {
    body.assignTo = additionalFields.assignTo;
  }

  if (additionalFields.tags) {
    body.tags = (additionalFields.tags as string).split(',').map((tag) => tag.trim());
  }

  if (additionalFields.cc) {
    body.cc = (additionalFields.cc as string).split(',').map((email) => email.trim());
  }

  if (additionalFields.bcc) {
    body.bcc = (additionalFields.bcc as string).split(',').map((email) => email.trim());
  }

  const response = await helpScoutApiRequest.call(this, 'POST', '/conversations', cleanObject(body));

  return toExecutionData(response);
}

/**
 * Get a conversation by ID
 */
export async function getConversation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const options = this.getNodeParameter('options', index) as IDataObject;

  const query: IDataObject = {};

  if (options.embed) {
    query.embed = options.embed;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    `/conversations/${conversationId}`,
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get all conversations
 */
export async function getAllConversations(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const query = buildQueryParams(filters);

  if (returnAll) {
    const conversations = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      '/conversations',
      {},
      query,
      'conversations',
    );
    return toExecutionData(conversations);
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.pageSize = Math.min(limit, 50);

  const response = await helpScoutApiRequest.call(this, 'GET', '/conversations', {}, query);

  let conversations: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).conversations) {
    conversations = (response._embedded as IDataObject).conversations as IDataObject[];
  }

  return toExecutionData(conversations.slice(0, limit));
}

/**
 * Update a conversation
 */
export async function updateConversation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const operations: Array<{ op: string; path: string; value: unknown }> = [];

  if (updateFields.subject) {
    operations.push({ op: 'replace', path: '/subject', value: updateFields.subject });
  }

  if (updateFields.status) {
    operations.push({ op: 'replace', path: '/status', value: updateFields.status });
  }

  if (updateFields.assignTo) {
    operations.push({ op: 'replace', path: '/assignTo', value: updateFields.assignTo });
  }

  const body = operations;

  await helpScoutApiRequest.call(
    this,
    'PATCH',
    `/conversations/${conversationId}`,
    body as unknown as IDataObject,
  );

  // Return the updated conversation
  return getConversation.call(this, index);
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;

  await helpScoutApiRequest.call(this, 'DELETE', `/conversations/${conversationId}`);

  return toExecutionData({ success: true, conversationId });
}

/**
 * Change conversation status
 */
export async function changeStatus(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const status = this.getNodeParameter('status', index) as string;

  const body = {
    op: 'replace',
    path: '/status',
    value: status,
  };

  await helpScoutApiRequest.call(
    this,
    'PATCH',
    `/conversations/${conversationId}`,
    [body] as unknown as IDataObject,
  );

  return toExecutionData({ success: true, conversationId, status });
}

/**
 * Move conversation to different mailbox
 */
export async function changeMailbox(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const mailboxId = this.getNodeParameter('mailboxId', index) as number;

  const body = {
    op: 'move',
    path: '/mailboxId',
    value: mailboxId,
  };

  await helpScoutApiRequest.call(
    this,
    'PATCH',
    `/conversations/${conversationId}`,
    [body] as unknown as IDataObject,
  );

  return toExecutionData({ success: true, conversationId, mailboxId });
}

/**
 * Assign conversation to user
 */
export async function assignUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const userId = this.getNodeParameter('userId', index) as number;

  const body = {
    op: 'replace',
    path: '/assignTo',
    value: userId,
  };

  await helpScoutApiRequest.call(
    this,
    'PATCH',
    `/conversations/${conversationId}`,
    [body] as unknown as IDataObject,
  );

  return toExecutionData({ success: true, conversationId, userId });
}

/**
 * Add tags to conversation
 */
export async function addTags(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const tags = this.getNodeParameter('tags', index) as string;

  const tagArray = tags.split(',').map((tag) => tag.trim());

  await helpScoutApiRequest.call(this, 'PUT', `/conversations/${conversationId}/tags`, {
    tags: tagArray,
  });

  return toExecutionData({ success: true, conversationId, tags: tagArray });
}

/**
 * Remove tags from conversation
 */
export async function removeTags(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;

  await helpScoutApiRequest.call(this, 'DELETE', `/conversations/${conversationId}/tags`);

  return toExecutionData({ success: true, conversationId });
}

/**
 * Get threads for a conversation
 */
export async function getThreads(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;

  const threads = await helpScoutApiRequestAllItems.call(
    this,
    'GET',
    `/conversations/${conversationId}/threads`,
    {},
    {},
    'threads',
  );

  return toExecutionData(threads);
}
