/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Build query parameters from node parameters
 */
export function buildQueryParams(params: IDataObject): IDataObject {
  const query: IDataObject = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          query[key] = value.join(',');
        }
      } else {
        query[key] = value;
      }
    }
  }

  return query;
}

/**
 * Clean undefined and null values from an object
 */
export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = cleanObject(value as IDataObject);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else if (Array.isArray(value)) {
        const cleanedArray = value.filter((item) => item !== undefined && item !== null);
        if (cleanedArray.length > 0) {
          cleaned[key] = cleanedArray;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * Format date for Help Scout API
 */
export function formatDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
}

/**
 * Parse HAL+JSON embedded data
 */
export function extractEmbeddedData<T>(response: IDataObject, propertyName: string): T[] {
  if (response._embedded && (response._embedded as IDataObject)[propertyName]) {
    return (response._embedded as IDataObject)[propertyName] as T[];
  }
  return [];
}

/**
 * Convert API response to n8n execution data format
 */
export function toExecutionData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
  if (Array.isArray(data)) {
    return data.map((item) => ({ json: item }));
  }
  return [{ json: data }];
}

/**
 * Parse a comma-separated string to array
 */
export function parseCommaSeparated(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Build customer object from parameters
 */
export function buildCustomerObject(params: IDataObject): IDataObject {
  const customer: IDataObject = {};

  if (params.customerEmail) {
    customer.email = params.customerEmail;
  }

  if (params.customerFirstName || params.customerLastName) {
    if (params.customerFirstName) {
      customer.firstName = params.customerFirstName;
    }
    if (params.customerLastName) {
      customer.lastName = params.customerLastName;
    }
  }

  if (params.customerId) {
    customer.id = params.customerId;
  }

  return customer;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random webhook secret
 */
export function generateWebhookSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

/**
 * Parse webhook payload to extract relevant data
 */
export function parseWebhookPayload(payload: IDataObject): IDataObject {
  const parsed: IDataObject = {
    event: payload.event,
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  // Extract conversation data if present
  if (payload.conversation) {
    parsed.conversation = payload.conversation;
  }

  // Extract customer data if present
  if (payload.customer) {
    parsed.customer = payload.customer;
  }

  // Extract thread data if present
  if (payload.thread) {
    parsed.thread = payload.thread;
  }

  // Extract rating data if present
  if (payload.rating) {
    parsed.rating = payload.rating;
  }

  return parsed;
}

/**
 * Build thread body with proper formatting
 */
export function buildThreadBody(
  text: string,
  isHtml: boolean = true,
): string {
  if (isHtml) {
    return text;
  }
  // Convert plain text to HTML with line breaks
  return text.replace(/\n/g, '<br>');
}

/**
 * Extract ID from HAL link
 */
export function extractIdFromLink(link: string): number | undefined {
  const match = link.match(/\/(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return undefined;
}

/**
 * Simplify response by removing HAL metadata
 */
export function simplifyResponse(response: IDataObject): IDataObject {
  const simplified: IDataObject = { ...response };

  // Remove HAL links
  delete simplified._links;

  // Extract embedded data
  if (simplified._embedded) {
    const embedded = simplified._embedded as IDataObject;
    for (const [key, value] of Object.entries(embedded)) {
      simplified[key] = value;
    }
    delete simplified._embedded;
  }

  return simplified;
}
