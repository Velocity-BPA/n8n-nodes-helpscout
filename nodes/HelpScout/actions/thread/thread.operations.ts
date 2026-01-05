/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { helpScoutApiRequest } from '../../transport/HelpScoutClient';
import { cleanObject, buildThreadBody, toExecutionData } from '../../utils/helpers';

/**
 * Create a customer thread
 */
export async function createCustomerThread(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const text = this.getNodeParameter('text', index) as string;
  const customerEmail = this.getNodeParameter('customerEmail', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    type: 'customer',
    text: buildThreadBody(text, additionalFields.isHtml as boolean),
    customer: {
      email: customerEmail,
    },
  };

  if (additionalFields.status) {
    body.status = additionalFields.status;
  }

  if (additionalFields.draft) {
    body.draft = additionalFields.draft;
  }

  if (additionalFields.imported) {
    body.imported = additionalFields.imported;
  }

  if (additionalFields.cc) {
    body.cc = (additionalFields.cc as string).split(',').map((email) => email.trim());
  }

  if (additionalFields.bcc) {
    body.bcc = (additionalFields.bcc as string).split(',').map((email) => email.trim());
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    `/conversations/${conversationId}/customer`,
    cleanObject(body),
  );

  return toExecutionData({ success: true, conversationId, ...response });
}

/**
 * Create a reply thread
 */
export async function createReplyThread(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const text = this.getNodeParameter('text', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    type: 'reply',
    text: buildThreadBody(text, additionalFields.isHtml as boolean),
  };

  if (additionalFields.status) {
    body.status = additionalFields.status;
  }

  if (additionalFields.draft) {
    body.draft = additionalFields.draft;
  }

  if (additionalFields.userId) {
    body.user = additionalFields.userId;
  }

  if (additionalFields.cc) {
    body.cc = (additionalFields.cc as string).split(',').map((email) => email.trim());
  }

  if (additionalFields.bcc) {
    body.bcc = (additionalFields.bcc as string).split(',').map((email) => email.trim());
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    `/conversations/${conversationId}/reply`,
    cleanObject(body),
  );

  return toExecutionData({ success: true, conversationId, ...response });
}

/**
 * Create a note thread
 */
export async function createNoteThread(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const text = this.getNodeParameter('text', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    type: 'note',
    text: buildThreadBody(text, additionalFields.isHtml as boolean),
  };

  if (additionalFields.userId) {
    body.user = additionalFields.userId;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    `/conversations/${conversationId}/notes`,
    cleanObject(body),
  );

  return toExecutionData({ success: true, conversationId, ...response });
}

/**
 * Create a phone thread
 */
export async function createPhoneThread(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const text = this.getNodeParameter('text', index) as string;
  const customerEmail = this.getNodeParameter('customerEmail', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    type: 'phone',
    text: buildThreadBody(text, additionalFields.isHtml as boolean),
    customer: {
      email: customerEmail,
    },
  };

  if (additionalFields.status) {
    body.status = additionalFields.status;
  }

  if (additionalFields.userId) {
    body.user = additionalFields.userId;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    `/conversations/${conversationId}/phones`,
    cleanObject(body),
  );

  return toExecutionData({ success: true, conversationId, ...response });
}

/**
 * Create a chat thread
 */
export async function createChatThread(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const text = this.getNodeParameter('text', index) as string;
  const customerEmail = this.getNodeParameter('customerEmail', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    type: 'chat',
    text: buildThreadBody(text, additionalFields.isHtml as boolean),
    customer: {
      email: customerEmail,
    },
  };

  if (additionalFields.status) {
    body.status = additionalFields.status;
  }

  if (additionalFields.userId) {
    body.user = additionalFields.userId;
  }

  const response = await helpScoutApiRequest.call(
    this,
    'POST',
    `/conversations/${conversationId}/chats`,
    cleanObject(body),
  );

  return toExecutionData({ success: true, conversationId, ...response });
}

/**
 * Get original thread source
 */
export async function getThreadSource(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const conversationId = this.getNodeParameter('conversationId', index) as number;
  const threadId = this.getNodeParameter('threadId', index) as number;

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    `/conversations/${conversationId}/threads/${threadId}/original-source`,
  );

  return toExecutionData(response);
}
