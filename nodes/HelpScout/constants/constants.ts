/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodePropertyOptions } from 'n8n-workflow';

export const CONVERSATION_STATUSES: INodePropertyOptions[] = [
  { name: 'Active', value: 'active' },
  { name: 'Pending', value: 'pending' },
  { name: 'Closed', value: 'closed' },
  { name: 'Spam', value: 'spam' },
];

export const CONVERSATION_TYPES: INodePropertyOptions[] = [
  { name: 'Email', value: 'email' },
  { name: 'Phone', value: 'phone' },
  { name: 'Chat', value: 'chat' },
];

export const THREAD_TYPES: INodePropertyOptions[] = [
  { name: 'Customer', value: 'customer' },
  { name: 'Message', value: 'message' },
  { name: 'Note', value: 'note' },
  { name: 'Phone', value: 'phone' },
  { name: 'Chat', value: 'chat' },
];

export const SORT_FIELDS: INodePropertyOptions[] = [
  { name: 'Created At', value: 'createdAt' },
  { name: 'Modified At', value: 'modifiedAt' },
  { name: 'Number', value: 'number' },
  { name: 'Score', value: 'score' },
  { name: 'Status', value: 'status' },
  { name: 'Subject', value: 'subject' },
  { name: 'Waiting Since', value: 'waitingSince' },
];

export const SORT_ORDERS: INodePropertyOptions[] = [
  { name: 'Ascending', value: 'asc' },
  { name: 'Descending', value: 'desc' },
];

export const WEBHOOK_EVENTS: INodePropertyOptions[] = [
  { name: 'Conversation Created', value: 'convo.created' },
  { name: 'Conversation Assigned', value: 'convo.assigned' },
  { name: 'Conversation Moved', value: 'convo.moved' },
  { name: 'Conversation Status Changed', value: 'convo.status' },
  { name: 'Conversation Tags Changed', value: 'convo.tags' },
  { name: 'Customer Reply Created', value: 'convo.customer.reply.created' },
  { name: 'Agent Reply Created', value: 'convo.agent.reply.created' },
  { name: 'Note Created', value: 'convo.note.created' },
  { name: 'Conversation Deleted', value: 'convo.deleted' },
  { name: 'Customer Created', value: 'customer.created' },
  { name: 'Satisfaction Rating', value: 'satisfaction.ratings' },
];

export const REPORT_TYPES: INodePropertyOptions[] = [
  { name: 'Company', value: 'company' },
  { name: 'Conversations', value: 'conversations' },
  { name: 'Productivity', value: 'productivity' },
  { name: 'Happiness', value: 'happiness' },
  { name: 'User', value: 'user' },
  { name: 'Chat', value: 'chat' },
  { name: 'Email', value: 'email' },
  { name: 'Phone', value: 'phone' },
];

export const PHONE_TYPES: INodePropertyOptions[] = [
  { name: 'Home', value: 'home' },
  { name: 'Work', value: 'work' },
  { name: 'Mobile', value: 'mobile' },
  { name: 'Fax', value: 'fax' },
  { name: 'Pager', value: 'pager' },
  { name: 'Other', value: 'other' },
];

export const EMAIL_TYPES: INodePropertyOptions[] = [
  { name: 'Work', value: 'work' },
  { name: 'Home', value: 'home' },
  { name: 'Other', value: 'other' },
];

export const SOCIAL_PROFILE_TYPES: INodePropertyOptions[] = [
  { name: 'Twitter', value: 'twitter' },
  { name: 'Facebook', value: 'facebook' },
  { name: 'LinkedIn', value: 'linkedin' },
  { name: 'Google Plus', value: 'googleplus' },
  { name: 'Other', value: 'other' },
];

export const GENDERS: INodePropertyOptions[] = [
  { name: 'Male', value: 'male' },
  { name: 'Female', value: 'female' },
  { name: 'Unknown', value: 'unknown' },
];

export const PAYLOAD_VERSIONS: INodePropertyOptions[] = [
  { name: 'V1', value: 'v1' },
  { name: 'V2', value: 'v2' },
];

export const BASE_URL = 'https://api.helpscout.net/v2';

export const RESOURCES = {
  CONVERSATION: 'conversation',
  THREAD: 'thread',
  CUSTOMER: 'customer',
  ORGANIZATION: 'organization',
  MAILBOX: 'mailbox',
  USER: 'user',
  TAG: 'tag',
  WORKFLOW: 'workflow',
  REPORT: 'report',
  WEBHOOK: 'webhook',
} as const;

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;
