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
import { toExecutionData } from '../../utils/helpers';

/**
 * Get a mailbox by ID
 */
export async function getMailbox(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const mailboxId = this.getNodeParameter('mailboxId', index) as number;

  const response = await helpScoutApiRequest.call(this, 'GET', `/mailboxes/${mailboxId}`);

  return toExecutionData(response);
}

/**
 * Get all mailboxes
 */
export async function getAllMailboxes(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const mailboxes = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      '/mailboxes',
      {},
      {},
      'mailboxes',
    );
    return toExecutionData(mailboxes);
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/mailboxes',
    {},
    { pageSize: Math.min(limit, 50) },
  );

  let mailboxes: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).mailboxes) {
    mailboxes = (response._embedded as IDataObject).mailboxes as IDataObject[];
  }

  return toExecutionData(mailboxes.slice(0, limit));
}

/**
 * Get mailbox folders
 */
export async function getMailboxFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const mailboxId = this.getNodeParameter('mailboxId', index) as number;

  const folders = await helpScoutApiRequestAllItems.call(
    this,
    'GET',
    `/mailboxes/${mailboxId}/folders`,
    {},
    {},
    'folders',
  );

  return toExecutionData(folders);
}

/**
 * Get mailbox custom fields
 */
export async function getMailboxFields(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const mailboxId = this.getNodeParameter('mailboxId', index) as number;

  const fields = await helpScoutApiRequestAllItems.call(
    this,
    'GET',
    `/mailboxes/${mailboxId}/fields`,
    {},
    {},
    'fields',
  );

  return toExecutionData(fields);
}
