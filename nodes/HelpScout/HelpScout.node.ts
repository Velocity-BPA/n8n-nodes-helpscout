/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { loadOptions, emitLicensingNotice } from './transport/HelpScoutClient';

// Conversation operations
import {
  createConversation,
  getConversation,
  getAllConversations,
  updateConversation,
  deleteConversation,
  changeStatus,
  changeMailbox,
  assignUser,
  addTags,
  removeTags,
  getThreads,
} from './actions/conversation/conversation.operations';

// Thread operations
import {
  createCustomerThread,
  createReplyThread,
  createNoteThread,
  createPhoneThread,
  createChatThread,
  getThreadSource,
} from './actions/thread/thread.operations';

// Customer operations
import {
  createCustomer,
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerConversations,
} from './actions/customer/customer.operations';

// Organization operations
import {
  createOrganization,
  getOrganization,
  getAllOrganizations,
  updateOrganization,
  deleteOrganization,
  getOrganizationConversations,
} from './actions/organization/organization.operations';

// Mailbox operations
import {
  getMailbox,
  getAllMailboxes,
  getMailboxFolders,
  getMailboxFields,
} from './actions/mailbox/mailbox.operations';

// User operations
import {
  getUser,
  getAllUsers,
  getResourceOwner,
} from './actions/user/user.operations';

// Tag operations
import { getAllTags } from './actions/tag/tag.operations';

// Workflow operations
import {
  getAllWorkflows,
  runManualWorkflow,
} from './actions/workflow/workflow.operations';

// Report operations
import {
  getCompanyReport,
  getConversationsReport,
  getProductivityReport,
  getHappinessReport,
  getUserReport,
  getChatReport,
  getEmailReport,
  getPhoneReport,
} from './actions/report/report.operations';

// Webhook operations
import {
  createWebhook,
  getAllWebhooks,
  updateWebhook,
  deleteWebhook,
} from './actions/webhook/webhook.operations';

import {
  CONVERSATION_STATUSES,
  CONVERSATION_TYPES,
  SORT_FIELDS,
  SORT_ORDERS,
  WEBHOOK_EVENTS,
  PHONE_TYPES,
  EMAIL_TYPES,
  GENDERS,
  PAYLOAD_VERSIONS,
} from './constants/constants';

export class HelpScout implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Help Scout',
    name: 'helpScout',
    icon: 'file:helpscout.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Help Scout API for customer service automation',
    defaults: {
      name: 'Help Scout',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'helpScoutApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Conversation', value: 'conversation' },
          { name: 'Thread', value: 'thread' },
          { name: 'Customer', value: 'customer' },
          { name: 'Organization', value: 'organization' },
          { name: 'Mailbox', value: 'mailbox' },
          { name: 'User', value: 'user' },
          { name: 'Tag', value: 'tag' },
          { name: 'Workflow', value: 'workflow' },
          { name: 'Report', value: 'report' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'conversation',
      },

      // ========== CONVERSATION OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['conversation'] },
        },
        options: [
          { name: 'Add Tags', value: 'addTags', description: 'Add tags to a conversation', action: 'Add tags to a conversation' },
          { name: 'Assign User', value: 'assignUser', description: 'Assign conversation to user', action: 'Assign conversation to user' },
          { name: 'Change Mailbox', value: 'changeMailbox', description: 'Move conversation to mailbox', action: 'Move conversation to mailbox' },
          { name: 'Change Status', value: 'changeStatus', description: 'Change conversation status', action: 'Change conversation status' },
          { name: 'Create', value: 'create', description: 'Create a new conversation', action: 'Create a conversation' },
          { name: 'Delete', value: 'delete', description: 'Delete a conversation', action: 'Delete a conversation' },
          { name: 'Get', value: 'get', description: 'Get a conversation by ID', action: 'Get a conversation' },
          { name: 'Get Many', value: 'getAll', description: 'Get many conversations', action: 'Get many conversations' },
          { name: 'Get Threads', value: 'getThreads', description: 'Get conversation threads', action: 'Get conversation threads' },
          { name: 'Remove Tags', value: 'removeTags', description: 'Remove tags from conversation', action: 'Remove tags from a conversation' },
          { name: 'Update', value: 'update', description: 'Update a conversation', action: 'Update a conversation' },
        ],
        default: 'getAll',
      },

      // ========== THREAD OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['thread'] },
        },
        options: [
          { name: 'Create Chat', value: 'createChat', description: 'Add chat thread', action: 'Create a chat thread' },
          { name: 'Create Customer', value: 'createCustomer', description: 'Add customer thread', action: 'Create a customer thread' },
          { name: 'Create Note', value: 'createNote', description: 'Add note thread', action: 'Create a note thread' },
          { name: 'Create Phone', value: 'createPhone', description: 'Add phone thread', action: 'Create a phone thread' },
          { name: 'Create Reply', value: 'createReply', description: 'Add reply thread', action: 'Create a reply thread' },
          { name: 'Get Source', value: 'getSource', description: 'Get original thread source', action: 'Get thread source' },
        ],
        default: 'createReply',
      },

      // ========== CUSTOMER OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['customer'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new customer', action: 'Create a customer' },
          { name: 'Delete', value: 'delete', description: 'Delete a customer', action: 'Delete a customer' },
          { name: 'Get', value: 'get', description: 'Get a customer by ID', action: 'Get a customer' },
          { name: 'Get Conversations', value: 'getConversations', description: 'Get customer conversations', action: 'Get customer conversations' },
          { name: 'Get Many', value: 'getAll', description: 'Get many customers', action: 'Get many customers' },
          { name: 'Update', value: 'update', description: 'Update a customer', action: 'Update a customer' },
        ],
        default: 'getAll',
      },

      // ========== ORGANIZATION OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['organization'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new organization', action: 'Create an organization' },
          { name: 'Delete', value: 'delete', description: 'Delete an organization', action: 'Delete an organization' },
          { name: 'Get', value: 'get', description: 'Get an organization by ID', action: 'Get an organization' },
          { name: 'Get Conversations', value: 'getConversations', description: 'Get organization conversations', action: 'Get organization conversations' },
          { name: 'Get Many', value: 'getAll', description: 'Get many organizations', action: 'Get many organizations' },
          { name: 'Update', value: 'update', description: 'Update an organization', action: 'Update an organization' },
        ],
        default: 'getAll',
      },

      // ========== MAILBOX OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['mailbox'] },
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a mailbox by ID', action: 'Get a mailbox' },
          { name: 'Get Fields', value: 'getFields', description: 'Get mailbox custom fields', action: 'Get mailbox custom fields' },
          { name: 'Get Folders', value: 'getFolders', description: 'Get mailbox folders', action: 'Get mailbox folders' },
          { name: 'Get Many', value: 'getAll', description: 'Get many mailboxes', action: 'Get many mailboxes' },
        ],
        default: 'getAll',
      },

      // ========== USER OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['user'] },
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a user by ID', action: 'Get a user' },
          { name: 'Get Many', value: 'getAll', description: 'Get many users', action: 'Get many users' },
          { name: 'Get Resource Owner', value: 'getResourceOwner', description: 'Get authenticated user', action: 'Get authenticated user' },
        ],
        default: 'getAll',
      },

      // ========== TAG OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['tag'] },
        },
        options: [
          { name: 'Get Many', value: 'getAll', description: 'Get all tags', action: 'Get all tags' },
        ],
        default: 'getAll',
      },

      // ========== WORKFLOW OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['workflow'] },
        },
        options: [
          { name: 'Get Many', value: 'getAll', description: 'Get all workflows', action: 'Get all workflows' },
          { name: 'Run Manual', value: 'runManual', description: 'Run manual workflow', action: 'Run manual workflow' },
        ],
        default: 'getAll',
      },

      // ========== REPORT OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['report'] },
        },
        options: [
          { name: 'Get Chat', value: 'getChat', description: 'Get chat report', action: 'Get chat report' },
          { name: 'Get Company', value: 'getCompany', description: 'Get company report', action: 'Get company report' },
          { name: 'Get Conversations', value: 'getConversations', description: 'Get conversations report', action: 'Get conversations report' },
          { name: 'Get Email', value: 'getEmail', description: 'Get email report', action: 'Get email report' },
          { name: 'Get Happiness', value: 'getHappiness', description: 'Get happiness report', action: 'Get happiness report' },
          { name: 'Get Phone', value: 'getPhone', description: 'Get phone report', action: 'Get phone report' },
          { name: 'Get Productivity', value: 'getProductivity', description: 'Get productivity report', action: 'Get productivity report' },
          { name: 'Get User', value: 'getUser', description: 'Get user report', action: 'Get user report' },
        ],
        default: 'getCompany',
      },

      // ========== WEBHOOK OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['webhook'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a webhook', action: 'Create a webhook' },
          { name: 'Delete', value: 'delete', description: 'Delete a webhook', action: 'Delete a webhook' },
          { name: 'Get Many', value: 'getAll', description: 'Get all webhooks', action: 'Get all webhooks' },
          { name: 'Update', value: 'update', description: 'Update a webhook', action: 'Update a webhook' },
        ],
        default: 'getAll',
      },

      // ========== CONVERSATION FIELDS ==========
      {
        displayName: 'Mailbox Name or ID',
        name: 'mailboxId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getMailboxes',
        },
        required: true,
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['create', 'changeMailbox'],
          },
        },
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        required: true,
        default: '',
        description: 'Conversation subject',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Customer Email',
        name: 'customerEmail',
        type: 'string',
        placeholder: 'name@email.com',
        required: true,
        default: '',
        description: 'Customer email address',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Conversation ID',
        name: 'conversationId',
        type: 'number',
        required: true,
        default: 0,
        description: 'The ID of the conversation',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['get', 'update', 'delete', 'changeStatus', 'changeMailbox', 'assignUser', 'addTags', 'removeTags', 'getThreads'],
          },
        },
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: CONVERSATION_STATUSES,
        required: true,
        default: 'active',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['changeStatus'],
          },
        },
      },
      {
        displayName: 'User Name or ID',
        name: 'userId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        required: true,
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['assignUser'],
          },
        },
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated list of tags',
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['addTags'],
          },
        },
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
          show: {
            resource: ['conversation', 'customer', 'organization', 'mailbox', 'user', 'workflow'],
            operation: ['getAll', 'getConversations'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
        displayOptions: {
          show: {
            resource: ['conversation', 'customer', 'organization', 'mailbox', 'user', 'workflow'],
            operation: ['getAll', 'getConversations'],
            returnAll: [false],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Assign To User Name or ID',
            name: 'assignTo',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getUsers',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
          },
          {
            displayName: 'BCC',
            name: 'bcc',
            type: 'string',
            default: '',
            description: 'Comma-separated BCC email addresses',
          },
          {
            displayName: 'CC',
            name: 'cc',
            type: 'string',
            default: '',
            description: 'Comma-separated CC email addresses',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: CONVERSATION_STATUSES,
            default: 'active',
          },
          {
            displayName: 'Tags',
            name: 'tags',
            type: 'string',
            default: '',
            description: 'Comma-separated list of tags',
          },
          {
            displayName: 'Text',
            name: 'text',
            type: 'string',
            typeOptions: {
              rows: 4,
            },
            default: '',
            description: 'Initial thread content (HTML)',
          },
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            options: CONVERSATION_TYPES,
            default: 'email',
          },
        ],
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['get'],
          },
        },
        options: [
          {
            displayName: 'Embed',
            name: 'embed',
            type: 'options',
            options: [
              { name: 'None', value: '' },
              { name: 'Threads', value: 'threads' },
            ],
            default: '',
            description: 'Include additional data',
          },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['update'],
          },
        },
        options: [
          {
            displayName: 'Assign To User Name or ID',
            name: 'assignTo',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getUsers',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: CONVERSATION_STATUSES,
            default: 'active',
          },
          {
            displayName: 'Subject',
            name: 'subject',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['conversation'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Assigned To User Name or ID',
            name: 'assignedTo',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getUsers',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
          },
          {
            displayName: 'Folder ID',
            name: 'folder',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Mailbox Name or ID',
            name: 'mailbox',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getMailboxes',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
          },
          {
            displayName: 'Modified Since',
            name: 'modifiedSince',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Query',
            name: 'query',
            type: 'string',
            default: '',
            description: 'Search query',
          },
          {
            displayName: 'Sort Field',
            name: 'sortField',
            type: 'options',
            options: SORT_FIELDS,
            default: 'modifiedAt',
          },
          {
            displayName: 'Sort Order',
            name: 'sortOrder',
            type: 'options',
            options: SORT_ORDERS,
            default: 'desc',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: CONVERSATION_STATUSES,
            default: '',
          },
          {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== THREAD FIELDS ==========
      {
        displayName: 'Conversation ID',
        name: 'conversationId',
        type: 'number',
        required: true,
        default: 0,
        description: 'The ID of the conversation',
        displayOptions: {
          show: {
            resource: ['thread'],
          },
        },
      },
      {
        displayName: 'Thread ID',
        name: 'threadId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
          show: {
            resource: ['thread'],
            operation: ['getSource'],
          },
        },
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        required: true,
        default: '',
        description: 'Thread content (HTML)',
        displayOptions: {
          show: {
            resource: ['thread'],
            operation: ['createCustomer', 'createReply', 'createNote', 'createPhone', 'createChat'],
          },
        },
      },
      {
        displayName: 'Customer Email',
        name: 'customerEmail',
        type: 'string',
        placeholder: 'name@email.com',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['thread'],
            operation: ['createCustomer', 'createPhone', 'createChat'],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['thread'],
            operation: ['createCustomer', 'createReply', 'createNote', 'createPhone', 'createChat'],
          },
        },
        options: [
          {
            displayName: 'BCC',
            name: 'bcc',
            type: 'string',
            default: '',
            description: 'Comma-separated BCC emails',
            displayOptions: {
              show: {
                '/operation': ['createCustomer', 'createReply'],
              },
            },
          },
          {
            displayName: 'CC',
            name: 'cc',
            type: 'string',
            default: '',
            description: 'Comma-separated CC emails',
            displayOptions: {
              show: {
                '/operation': ['createCustomer', 'createReply'],
              },
            },
          },
          {
            displayName: 'Draft',
            name: 'draft',
            type: 'boolean',
            default: false,
            displayOptions: {
              show: {
                '/operation': ['createCustomer', 'createReply'],
              },
            },
          },
          {
            displayName: 'Imported',
            name: 'imported',
            type: 'boolean',
            default: false,
            displayOptions: {
              show: {
                '/operation': ['createCustomer'],
              },
            },
          },
          {
            displayName: 'Is HTML',
            name: 'isHtml',
            type: 'boolean',
            default: true,
            description: 'Whether the text is HTML formatted',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: CONVERSATION_STATUSES,
            default: 'active',
            displayOptions: {
              show: {
                '/operation': ['createCustomer', 'createReply', 'createPhone', 'createChat'],
              },
            },
          },
          {
            displayName: 'User Name or ID',
            name: 'userId',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getUsers',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
            displayOptions: {
              show: {
                '/operation': ['createReply', 'createNote', 'createPhone', 'createChat'],
              },
            },
          },
        ],
      },

      // ========== CUSTOMER FIELDS ==========
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['customer'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['customer'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
          show: {
            resource: ['customer'],
            operation: ['get', 'update', 'delete', 'getConversations'],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['customer'],
            operation: ['create'],
          },
        },
        options: [
          { displayName: 'Age', name: 'age', type: 'string', default: '' },
          { displayName: 'Background', name: 'background', type: 'string', default: '' },
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'Email Type', name: 'emailType', type: 'options', options: EMAIL_TYPES, default: 'work' },
          { displayName: 'Gender', name: 'gender', type: 'options', options: GENDERS, default: 'unknown' },
          { displayName: 'Job Title', name: 'jobTitle', type: 'string', default: '' },
          { displayName: 'Location', name: 'location', type: 'string', default: '' },
          { displayName: 'Organization', name: 'organization', type: 'string', default: '' },
          { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
          { displayName: 'Phone Type', name: 'phoneType', type: 'options', options: PHONE_TYPES, default: 'work' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['customer'],
            operation: ['update'],
          },
        },
        options: [
          { displayName: 'Age', name: 'age', type: 'string', default: '' },
          { displayName: 'Background', name: 'background', type: 'string', default: '' },
          { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
          { displayName: 'Gender', name: 'gender', type: 'options', options: GENDERS, default: 'unknown' },
          { displayName: 'Job Title', name: 'jobTitle', type: 'string', default: '' },
          { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
          { displayName: 'Location', name: 'location', type: 'string', default: '' },
          { displayName: 'Organization', name: 'organization', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['customer'],
            operation: ['getAll'],
          },
        },
        options: [
          { displayName: 'Created Since', name: 'createdSince', type: 'dateTime', default: '' },
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
          { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
          { displayName: 'Modified Since', name: 'modifiedSince', type: 'dateTime', default: '' },
          { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
          { displayName: 'Query', name: 'query', type: 'string', default: '' },
          {
            displayName: 'Sort Field',
            name: 'sortField',
            type: 'options',
            options: [
              { name: 'First Name', value: 'firstName' },
              { name: 'Last Name', value: 'lastName' },
              { name: 'Modified At', value: 'modifiedAt' },
              { name: 'Score', value: 'score' },
            ],
            default: 'modifiedAt',
          },
          { displayName: 'Sort Order', name: 'sortOrder', type: 'options', options: SORT_ORDERS, default: 'desc' },
        ],
      },

      // ========== ORGANIZATION FIELDS ==========
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['get', 'update', 'delete', 'getConversations'],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['create'],
          },
        },
        options: [
          { displayName: 'Domain', name: 'domain', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['update'],
          },
        },
        options: [
          { displayName: 'Domain', name: 'domain', type: 'string', default: '' },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },

      // ========== MAILBOX FIELDS ==========
      {
        displayName: 'Mailbox Name or ID',
        name: 'mailboxId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getMailboxes',
        },
        required: true,
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
          show: {
            resource: ['mailbox'],
            operation: ['get', 'getFolders', 'getFields'],
          },
        },
      },

      // ========== USER FIELDS ==========
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['get'],
          },
        },
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['getAll'],
          },
        },
        options: [
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          {
            displayName: 'Mailbox Name or ID',
            name: 'mailbox',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getMailboxes',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
          },
        ],
      },

      // ========== WORKFLOW FIELDS ==========
      {
        displayName: 'Workflow ID',
        name: 'workflowId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
          show: {
            resource: ['workflow'],
            operation: ['runManual'],
          },
        },
      },
      {
        displayName: 'Conversation IDs',
        name: 'conversationIds',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated conversation IDs',
        displayOptions: {
          show: {
            resource: ['workflow'],
            operation: ['runManual'],
          },
        },
      },

      // ========== REPORT FIELDS ==========
      {
        displayName: 'User Name or ID',
        name: 'userId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        required: true,
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
          show: {
            resource: ['report'],
            operation: ['getUser'],
          },
        },
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['report'],
          },
        },
        options: [
          { displayName: 'End Date', name: 'end', type: 'dateTime', default: '' },
          { displayName: 'Folders', name: 'folders', type: 'string', default: '', description: 'Comma-separated folder IDs' },
          { displayName: 'Mailboxes', name: 'mailboxes', type: 'string', default: '', description: 'Comma-separated mailbox IDs' },
          { displayName: 'Office Hours', name: 'officeHours', type: 'boolean', default: false },
          { displayName: 'Start Date', name: 'start', type: 'dateTime', default: '' },
          { displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated tags' },
          { displayName: 'Types', name: 'types', type: 'string', default: '', description: 'Comma-separated conversation types' },
        ],
      },

      // ========== WEBHOOK FIELDS ==========
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'https://example.com/webhook',
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: WEBHOOK_EVENTS,
        required: true,
        default: [],
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['update', 'delete'],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['create'],
          },
        },
        options: [
          { displayName: 'Label', name: 'label', type: 'string', default: '' },
          { displayName: 'Payload Version', name: 'payloadVersion', type: 'options', options: PAYLOAD_VERSIONS, default: 'v2' },
          { displayName: 'Secret', name: 'secret', type: 'string', typeOptions: { password: true }, default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['update'],
          },
        },
        options: [
          { displayName: 'Events', name: 'events', type: 'multiOptions', options: WEBHOOK_EVENTS, default: [] },
          { displayName: 'Label', name: 'label', type: 'string', default: '' },
          { displayName: 'Payload Version', name: 'payloadVersion', type: 'options', options: PAYLOAD_VERSIONS, default: 'v2' },
          { displayName: 'Secret', name: 'secret', type: 'string', typeOptions: { password: true }, default: '' },
          { displayName: 'State', name: 'state', type: 'options', options: [{ name: 'Enabled', value: 'enabled' }, { name: 'Disabled', value: 'disabled' }], default: 'enabled' },
          { displayName: 'URL', name: 'url', type: 'string', default: '' },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      async getMailboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return loadOptions.call(this, '/mailboxes', 'mailboxes', 'name', 'id');
      },
      async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const users = await loadOptions.call(this, '/users', 'users', 'email', 'id');
        return users.map((user) => ({
          name: user.name,
          value: user.value,
        }));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Emit licensing notice once per node load
    emitLicensingNotice.call(this);

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: INodeExecutionData[] = [];

        // Route to appropriate handler
        switch (resource) {
          case 'conversation':
            switch (operation) {
              case 'create':
                result = await createConversation.call(this, i);
                break;
              case 'get':
                result = await getConversation.call(this, i);
                break;
              case 'getAll':
                result = await getAllConversations.call(this, i);
                break;
              case 'update':
                result = await updateConversation.call(this, i);
                break;
              case 'delete':
                result = await deleteConversation.call(this, i);
                break;
              case 'changeStatus':
                result = await changeStatus.call(this, i);
                break;
              case 'changeMailbox':
                result = await changeMailbox.call(this, i);
                break;
              case 'assignUser':
                result = await assignUser.call(this, i);
                break;
              case 'addTags':
                result = await addTags.call(this, i);
                break;
              case 'removeTags':
                result = await removeTags.call(this, i);
                break;
              case 'getThreads':
                result = await getThreads.call(this, i);
                break;
            }
            break;

          case 'thread':
            switch (operation) {
              case 'createCustomer':
                result = await createCustomerThread.call(this, i);
                break;
              case 'createReply':
                result = await createReplyThread.call(this, i);
                break;
              case 'createNote':
                result = await createNoteThread.call(this, i);
                break;
              case 'createPhone':
                result = await createPhoneThread.call(this, i);
                break;
              case 'createChat':
                result = await createChatThread.call(this, i);
                break;
              case 'getSource':
                result = await getThreadSource.call(this, i);
                break;
            }
            break;

          case 'customer':
            switch (operation) {
              case 'create':
                result = await createCustomer.call(this, i);
                break;
              case 'get':
                result = await getCustomer.call(this, i);
                break;
              case 'getAll':
                result = await getAllCustomers.call(this, i);
                break;
              case 'update':
                result = await updateCustomer.call(this, i);
                break;
              case 'delete':
                result = await deleteCustomer.call(this, i);
                break;
              case 'getConversations':
                result = await getCustomerConversations.call(this, i);
                break;
            }
            break;

          case 'organization':
            switch (operation) {
              case 'create':
                result = await createOrganization.call(this, i);
                break;
              case 'get':
                result = await getOrganization.call(this, i);
                break;
              case 'getAll':
                result = await getAllOrganizations.call(this, i);
                break;
              case 'update':
                result = await updateOrganization.call(this, i);
                break;
              case 'delete':
                result = await deleteOrganization.call(this, i);
                break;
              case 'getConversations':
                result = await getOrganizationConversations.call(this, i);
                break;
            }
            break;

          case 'mailbox':
            switch (operation) {
              case 'get':
                result = await getMailbox.call(this, i);
                break;
              case 'getAll':
                result = await getAllMailboxes.call(this, i);
                break;
              case 'getFolders':
                result = await getMailboxFolders.call(this, i);
                break;
              case 'getFields':
                result = await getMailboxFields.call(this, i);
                break;
            }
            break;

          case 'user':
            switch (operation) {
              case 'get':
                result = await getUser.call(this, i);
                break;
              case 'getAll':
                result = await getAllUsers.call(this, i);
                break;
              case 'getResourceOwner':
                result = await getResourceOwner.call(this, i);
                break;
            }
            break;

          case 'tag':
            switch (operation) {
              case 'getAll':
                result = await getAllTags.call(this, i);
                break;
            }
            break;

          case 'workflow':
            switch (operation) {
              case 'getAll':
                result = await getAllWorkflows.call(this, i);
                break;
              case 'runManual':
                result = await runManualWorkflow.call(this, i);
                break;
            }
            break;

          case 'report':
            switch (operation) {
              case 'getCompany':
                result = await getCompanyReport.call(this, i);
                break;
              case 'getConversations':
                result = await getConversationsReport.call(this, i);
                break;
              case 'getProductivity':
                result = await getProductivityReport.call(this, i);
                break;
              case 'getHappiness':
                result = await getHappinessReport.call(this, i);
                break;
              case 'getUser':
                result = await getUserReport.call(this, i);
                break;
              case 'getChat':
                result = await getChatReport.call(this, i);
                break;
              case 'getEmail':
                result = await getEmailReport.call(this, i);
                break;
              case 'getPhone':
                result = await getPhoneReport.call(this, i);
                break;
            }
            break;

          case 'webhook':
            switch (operation) {
              case 'create':
                result = await createWebhook.call(this, i);
                break;
              case 'getAll':
                result = await getAllWebhooks.call(this, i);
                break;
              case 'update':
                result = await updateWebhook.call(this, i);
                break;
              case 'delete':
                result = await deleteWebhook.call(this, i);
                break;
            }
            break;
        }

        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
