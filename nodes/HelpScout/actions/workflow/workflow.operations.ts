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
 * Get all workflows
 */
export async function getAllWorkflows(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const workflows = await helpScoutApiRequestAllItems.call(
      this,
      'GET',
      '/workflows',
      {},
      {},
      'workflows',
    );
    return toExecutionData(workflows);
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/workflows',
    {},
    { pageSize: Math.min(limit, 50) },
  );

  let workflows: IDataObject[] = [];
  if (response._embedded && (response._embedded as IDataObject).workflows) {
    workflows = (response._embedded as IDataObject).workflows as IDataObject[];
  }

  return toExecutionData(workflows.slice(0, limit));
}

/**
 * Run a manual workflow
 */
export async function runManualWorkflow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const workflowId = this.getNodeParameter('workflowId', index) as number;
  const conversationIds = this.getNodeParameter('conversationIds', index) as string;

  const ids = conversationIds.split(',').map((id) => parseInt(id.trim(), 10));

  const body = {
    conversationIds: ids,
  };

  await helpScoutApiRequest.call(
    this,
    'POST',
    `/workflows/${workflowId}/run`,
    body as IDataObject,
  );

  return toExecutionData({ success: true, workflowId, conversationIds: ids });
}
