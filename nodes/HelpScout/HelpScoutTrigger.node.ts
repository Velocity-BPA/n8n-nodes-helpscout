/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import { helpScoutApiRequest } from './transport/HelpScoutClient';
import { WEBHOOK_EVENTS } from './constants/constants';

export class HelpScoutTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Help Scout Trigger',
    name: 'helpScoutTrigger',
    icon: 'file:helpscout.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts the workflow when Help Scout events occur',
    defaults: {
      name: 'Help Scout Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'helpScoutApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: WEBHOOK_EVENTS,
        required: true,
        default: [],
        description: 'Events that will trigger the webhook',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Payload Version',
            name: 'payloadVersion',
            type: 'options',
            options: [
              { name: 'V1', value: 'v1' },
              { name: 'V2', value: 'v2' },
            ],
            default: 'v2',
            description: 'Version of the webhook payload format',
          },
          {
            displayName: 'Webhook Label',
            name: 'label',
            type: 'string',
            default: '',
            description: 'Label to identify this webhook in Help Scout',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const webhookData = this.getWorkflowStaticData('node');

        // If we have a stored webhook ID, verify it still exists
        if (webhookData.webhookId) {
          try {
            const webhooks = await helpScoutApiRequest.call(
              this,
              'GET',
              '/webhooks',
            ) as IDataObject;

            const existingWebhooks = (webhooks._embedded as IDataObject)?.webhooks as IDataObject[] || [];

            const found = existingWebhooks.find(
              (webhook) => webhook.id === webhookData.webhookId && webhook.url === webhookUrl,
            );

            if (found) {
              return true;
            }
          } catch {
            // Webhook doesn't exist anymore
          }
        }

        // Check if there's a webhook with our URL
        try {
          const webhooks = await helpScoutApiRequest.call(
            this,
            'GET',
            '/webhooks',
          ) as IDataObject;

          const existingWebhooks = (webhooks._embedded as IDataObject)?.webhooks as IDataObject[] || [];

          const found = existingWebhooks.find((webhook) => webhook.url === webhookUrl);

          if (found) {
            webhookData.webhookId = found.id;
            webhookData.secret = found.secret;
            return true;
          }
        } catch {
          // Error checking webhooks
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events') as string[];
        const options = this.getNodeParameter('options') as IDataObject;

        // Generate a secure secret for webhook verification
        const secret = crypto.randomBytes(32).toString('hex');

        const body: IDataObject = {
          url: webhookUrl,
          events,
          secret,
          payloadVersion: options.payloadVersion || 'v2',
        };

        if (options.label) {
          body.label = options.label;
        }

        try {
          const response = await helpScoutApiRequest.call(
            this,
            'POST',
            '/webhooks',
            body,
          );

          const webhookData = this.getWorkflowStaticData('node');

          // Extract webhook ID from Location header or response
          if (response.id) {
            webhookData.webhookId = response.id;
          }
          webhookData.secret = secret;

          return true;
        } catch (error) {
          throw new Error(`Failed to create webhook: ${(error as Error).message}`);
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');

        if (webhookData.webhookId) {
          try {
            await helpScoutApiRequest.call(
              this,
              'DELETE',
              `/webhooks/${webhookData.webhookId}`,
            );
          } catch {
            // Ignore deletion errors - webhook may already be deleted
          }

          delete webhookData.webhookId;
          delete webhookData.secret;
        }

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const webhookData = this.getWorkflowStaticData('node');
    const req = this.getRequestObject();
    const body = this.getBodyData() as IDataObject;

    // Verify webhook signature if secret is set
    if (webhookData.secret) {
      const signature = req.headers['x-helpscout-signature'] as string;

      if (signature) {
        const expectedSignature = crypto
          .createHmac('sha1', webhookData.secret as string)
          .update(JSON.stringify(body))
          .digest('base64');

        if (signature !== expectedSignature) {
          // Signature mismatch - could be a spoofed request
          return {
            workflowData: [
              [
                {
                  json: {
                    error: 'Invalid signature',
                  },
                },
              ],
            ],
          };
        }
      }
    }

    // Process the webhook payload
    const returnData: IDataObject = {
      event: body.event || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Include all payload data
    if (body.conversation) {
      returnData.conversation = body.conversation;
    }

    if (body.customer) {
      returnData.customer = body.customer;
    }

    if (body.thread) {
      returnData.thread = body.thread;
    }

    if (body.user) {
      returnData.user = body.user;
    }

    if (body.mailbox) {
      returnData.mailbox = body.mailbox;
    }

    if (body.rating) {
      returnData.rating = body.rating;
    }

    // Include tags if present
    if (body.tags) {
      returnData.tags = body.tags;
    }

    // Include any additional payload data
    for (const [key, value] of Object.entries(body)) {
      if (!returnData[key]) {
        returnData[key] = value;
      }
    }

    return {
      workflowData: [
        [
          {
            json: returnData,
          },
        ],
      ],
    };
  }
}
