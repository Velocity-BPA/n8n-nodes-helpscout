/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { helpScoutApiRequestAllItems } from '../../transport/HelpScoutClient';
import { toExecutionData } from '../../utils/helpers';

/**
 * Get all tags
 */
export async function getAllTags(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const tags = await helpScoutApiRequestAllItems.call(
    this,
    'GET',
    '/tags',
    {},
    {},
    'tags',
  );

  return toExecutionData(tags);
}
