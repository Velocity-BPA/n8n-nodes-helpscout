/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IWebhookFunctions,
  JsonObject,
  NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';

import {
  IHelpScoutCredentials,
  IHelpScoutResponse,
  IOAuthToken,
} from '../types/HelpScoutTypes';

const BASE_URL = 'https://api.helpscout.net/v2';
const TOKEN_URL = 'https://api.helpscout.net/v2/oauth2/token';

// Token cache with expiration
interface TokenCache {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, TokenCache>();

/**
 * Get OAuth access token with caching
 */
async function getAccessToken(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions | IWebhookFunctions,
  credentials: IHelpScoutCredentials,
): Promise<string> {
  const cacheKey = `${credentials.appId}`;
  const cached = tokenCache.get(cacheKey);

  // Return cached token if still valid (with 60-second buffer)
  if (cached && Date.now() < cached.expiresAt - 60000) {
    return cached.token;
  }

  const options: IHttpRequestOptions = {
    method: 'POST',
    url: TOKEN_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: credentials.appId as string,
      client_secret: credentials.appSecret as string,
    }).toString(),
  };

  try {
    const response = (await this.helpers.httpRequest(options)) as IOAuthToken;

    if (!response.access_token) {
      throw new NodeOperationError(this.getNode(), 'Failed to obtain access token');
    }

    // Cache the token
    tokenCache.set(cacheKey, {
      token: response.access_token,
      expiresAt: Date.now() + response.expires_in * 1000,
    });

    return response.access_token;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: 'Failed to authenticate with Help Scout',
    });
  }
}

/**
 * Make an authenticated API request to Help Scout
 */
export async function helpScoutApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  uri?: string,
): Promise<IDataObject> {
  const credentials = (await this.getCredentials('helpScoutApi')) as IHelpScoutCredentials;

  let authHeader: string;

  if (credentials.authType === 'oauth2') {
    const token = await getAccessToken.call(this, credentials);
    authHeader = `Bearer ${token}`;
  } else {
    // API Key authentication uses Basic Auth
    const apiKey = credentials.apiKey as string;
    authHeader = `Basic ${Buffer.from(`${apiKey}:X`).toString('base64')}`;
  }

  const options: IHttpRequestOptions = {
    method,
    url: uri || `${BASE_URL}${endpoint}`,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    qs: query,
    json: true,
  };

  if (Object.keys(body).length > 0) {
    options.body = body;
  }

  try {
    const response = await this.helpers.httpRequest(options);

    // Handle 204 No Content responses
    if (response === undefined || response === '') {
      return { success: true };
    }

    return response as IDataObject;
  } catch (error) {
    const errorData = error as JsonObject;

    // Handle specific HTTP status codes
    if ((errorData as IDataObject).statusCode === 429) {
      throw new NodeApiError(this.getNode(), errorData, {
        message: 'Rate limit exceeded. Please try again later.',
        httpCode: '429',
      });
    }

    if ((errorData as IDataObject).statusCode === 401) {
      // Clear token cache on auth failure
      if (credentials.authType === 'oauth2') {
        tokenCache.delete(credentials.appId as string);
      }
      throw new NodeApiError(this.getNode(), errorData, {
        message: 'Authentication failed. Please check your credentials.',
        httpCode: '401',
      });
    }

    if ((errorData as IDataObject).statusCode === 404) {
      throw new NodeApiError(this.getNode(), errorData, {
        message: 'Resource not found.',
        httpCode: '404',
      });
    }

    throw new NodeApiError(this.getNode(), errorData);
  }
}

/**
 * Make an API request and return all results with pagination
 */
export async function helpScoutApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  propertyName: string,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let responseData: IHelpScoutResponse<IDataObject>;
  let uri: string | undefined;

  query.page = 1;

  do {
    responseData = (await helpScoutApiRequest.call(
      this,
      method,
      endpoint,
      body,
      query,
      uri,
    )) as IHelpScoutResponse<IDataObject>;

    if (responseData._embedded && responseData._embedded[propertyName]) {
      returnData.push(...responseData._embedded[propertyName]);
    }

    // Get next page URL from HAL links
    uri = responseData._links?.next?.href as string | undefined;
    query = {}; // Clear query as it's included in the next URL
  } while (uri);

  return returnData;
}

/**
 * Load options for dynamic dropdowns
 */
export async function loadOptions(
  this: ILoadOptionsFunctions,
  endpoint: string,
  propertyName: string,
  labelField: string,
  valueField: string,
): Promise<Array<{ name: string; value: string | number }>> {
  const returnData: Array<{ name: string; value: string | number }> = [];

  const items = await helpScoutApiRequestAllItems.call(
    this,
    'GET',
    endpoint,
    {},
    {},
    propertyName,
  );

  for (const item of items) {
    returnData.push({
      name: item[labelField] as string,
      value: item[valueField] as string | number,
    });
  }

  return returnData;
}

/**
 * Clear the token cache (useful for testing)
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}

/**
 * Emit licensing notice (called once per node load)
 */
let licensingNoticeEmitted = false;

export function emitLicensingNotice(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions | IWebhookFunctions,
): void {
  if (!licensingNoticeEmitted) {
    const logger = this.getNode().typeVersion >= 1 ? console : console;
    logger.warn(
      '[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
        'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
        'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
    );
    licensingNoticeEmitted = true;
  }
}
