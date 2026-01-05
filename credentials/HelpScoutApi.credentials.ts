/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class HelpScoutApi implements ICredentialType {
  name = 'helpScoutApi';
  displayName = 'Help Scout API';
  documentationUrl = 'https://developer.helpscout.com/mailbox-api/';
  properties: INodeProperties[] = [
    {
      displayName: 'Authentication Type',
      name: 'authType',
      type: 'options',
      options: [
        {
          name: 'OAuth 2.0 (Recommended)',
          value: 'oauth2',
        },
        {
          name: 'API Key (Legacy)',
          value: 'apiKey',
        },
      ],
      default: 'oauth2',
      description: 'Choose authentication method',
    },
    {
      displayName: 'App ID',
      name: 'appId',
      type: 'string',
      default: '',
      placeholder: 'Your OAuth App ID',
      description: 'The App ID from your Help Scout OAuth application',
      displayOptions: {
        show: {
          authType: ['oauth2'],
        },
      },
    },
    {
      displayName: 'App Secret',
      name: 'appSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      placeholder: 'Your OAuth App Secret',
      description: 'The App Secret from your Help Scout OAuth application',
      displayOptions: {
        show: {
          authType: ['oauth2'],
        },
      },
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      placeholder: 'Your API Key',
      description: 'The API key from your Help Scout account',
      displayOptions: {
        show: {
          authType: ['apiKey'],
        },
      },
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.helpscout.net/v2',
      url: '/users/me',
    },
  };
}
