/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject } from 'n8n-workflow';

// Resource types
export type HelpScoutResource =
  | 'conversation'
  | 'thread'
  | 'customer'
  | 'organization'
  | 'mailbox'
  | 'user'
  | 'tag'
  | 'workflow'
  | 'report'
  | 'webhook';

// Conversation types
export type ConversationStatus = 'active' | 'pending' | 'closed' | 'spam';
export type ConversationType = 'email' | 'phone' | 'chat';

export interface IConversation extends IDataObject {
  id?: number;
  number?: number;
  type?: ConversationType;
  folderId?: number;
  status?: ConversationStatus;
  state?: string;
  subject?: string;
  preview?: string;
  mailboxId?: number;
  assignee?: IUser;
  createdBy?: IUser | ICustomer;
  createdAt?: string;
  closedBy?: number;
  closedByUser?: IUser;
  closedAt?: string;
  userUpdatedAt?: string;
  customerWaitingSince?: IWaitingSince;
  source?: ISource;
  tags?: ITag[];
  cc?: string[];
  bcc?: string[];
  primaryCustomer?: ICustomer;
  customFields?: ICustomField[];
  _embedded?: {
    threads?: IThread[];
  };
}

export interface IWaitingSince extends IDataObject {
  time?: string;
  friendly?: string;
  latestReplyFrom?: string;
}

export interface ISource extends IDataObject {
  type?: string;
  via?: string;
}

// Thread types
export type ThreadType = 'customer' | 'message' | 'note' | 'phone' | 'chat' | 'lineitem';
export type ThreadStatus = 'active' | 'closed' | 'nochange' | 'pending' | 'spam';

export interface IThread extends IDataObject {
  id?: number;
  type?: ThreadType;
  status?: ThreadStatus;
  state?: string;
  action?: IThreadAction;
  body?: string;
  source?: ISource;
  customer?: ICustomer;
  createdBy?: IUser | ICustomer;
  assignedTo?: IUser;
  savedReplyId?: number;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  createdAt?: string;
  openedAt?: string;
  attachments?: IAttachment[];
}

export interface IThreadAction extends IDataObject {
  type?: string;
  text?: string;
}

export interface IAttachment extends IDataObject {
  id?: number;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  size?: number;
  hash?: string;
}

// Customer types
export interface ICustomer extends IDataObject {
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  photoUrl?: string;
  photoType?: string;
  gender?: string;
  age?: string;
  organization?: string;
  jobTitle?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  background?: string;
  emails?: IEmail[];
  phones?: IPhone[];
  chats?: IChat[];
  socialProfiles?: ISocialProfile[];
  websites?: IWebsite[];
  addresses?: IAddress[];
  properties?: ICustomerProperty[];
}

export interface IEmail extends IDataObject {
  id?: number;
  value?: string;
  type?: string;
}

export interface IPhone extends IDataObject {
  id?: number;
  value?: string;
  type?: string;
}

export interface IChat extends IDataObject {
  id?: number;
  value?: string;
  type?: string;
}

export interface ISocialProfile extends IDataObject {
  id?: number;
  value?: string;
  type?: string;
}

export interface IWebsite extends IDataObject {
  id?: number;
  value?: string;
}

export interface IAddress extends IDataObject {
  id?: number;
  lines?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ICustomerProperty extends IDataObject {
  type?: string;
  name?: string;
  value?: string;
}

// Organization types
export interface IOrganization extends IDataObject {
  id?: number;
  name?: string;
  domain?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User types
export interface IUser extends IDataObject {
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  timezone?: string;
  photoUrl?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mailbox types
export interface IMailbox extends IDataObject {
  id?: number;
  name?: string;
  slug?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFolder extends IDataObject {
  id?: number;
  name?: string;
  type?: string;
  userId?: number;
  totalCount?: number;
  activeCount?: number;
  updatedAt?: string;
}

export interface ICustomField extends IDataObject {
  id?: number;
  name?: string;
  type?: string;
  required?: boolean;
  order?: number;
  options?: IFieldOption[];
  value?: string;
}

export interface IFieldOption extends IDataObject {
  id?: number;
  label?: string;
  order?: number;
}

// Tag types
export interface ITag extends IDataObject {
  id?: number;
  name?: string;
  slug?: string;
  color?: string;
  createdAt?: string;
  ticketCount?: number;
}

// Workflow types
export interface IWorkflow extends IDataObject {
  id?: number;
  mailboxId?: number;
  type?: string;
  status?: string;
  order?: number;
  name?: string;
  createdAt?: string;
  modifiedAt?: string;
}

// Report types
export interface IReport extends IDataObject {
  filterTags?: ITag[];
  current?: IReportData;
  previous?: IReportData;
  deltas?: IReportDelta;
}

export interface IReportData extends IDataObject {
  startDate?: string;
  endDate?: string;
}

export interface IReportDelta extends IDataObject {
  [key: string]: number;
}

// Webhook types
export type WebhookEvent =
  | 'convo.created'
  | 'convo.assigned'
  | 'convo.moved'
  | 'convo.status'
  | 'convo.tags'
  | 'convo.customer.reply.created'
  | 'convo.agent.reply.created'
  | 'convo.note.created'
  | 'convo.deleted'
  | 'customer.created'
  | 'satisfaction.ratings';

export interface IWebhook extends IDataObject {
  id?: number;
  url?: string;
  state?: string;
  events?: WebhookEvent[];
  secret?: string;
  payloadVersion?: string;
  label?: string;
  createdAt?: string;
  modifiedAt?: string;
}

// API Response types
export interface IHelpScoutResponse<T> extends IDataObject {
  _embedded?: {
    [key: string]: T[];
  };
  _links?: IHalLinks;
  page?: IPageInfo;
}

export interface IHalLinks extends IDataObject {
  self?: IHalLink;
  next?: IHalLink;
  first?: IHalLink;
  last?: IHalLink;
}

export interface IHalLink extends IDataObject {
  href?: string;
}

export interface IPageInfo extends IDataObject {
  size?: number;
  totalElements?: number;
  totalPages?: number;
  number?: number;
}

// OAuth types
export interface IOAuthToken extends IDataObject {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Credential types
export interface IHelpScoutCredentials extends IDataObject {
  authType: 'oauth2' | 'apiKey';
  appId?: string;
  appSecret?: string;
  apiKey?: string;
}
