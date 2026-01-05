/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  buildQueryParams,
  cleanObject,
  formatDate,
  generateWebhookSecret,
  simplifyResponse,
  toExecutionData,
  parseCommaSeparated,
  buildCustomerObject,
  isValidEmail,
  buildThreadBody,
  extractIdFromLink,
  parseWebhookPayload,
  extractEmbeddedData,
} from '../../nodes/HelpScout/utils/helpers';

describe('Helper Functions', () => {
  describe('buildQueryParams', () => {
    it('should build query params from object', () => {
      const params = {
        status: 'active',
        mailbox: 123,
        tag: 'urgent',
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        status: 'active',
        mailbox: 123,
        tag: 'urgent',
      });
    });

    it('should filter out undefined and empty values', () => {
      const params = {
        status: 'active',
        mailbox: undefined,
        tag: '',
        query: null,
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        status: 'active',
      });
    });

    it('should handle empty object', () => {
      const result = buildQueryParams({});
      expect(result).toEqual({});
    });

    it('should join arrays with commas', () => {
      const params = {
        tags: ['urgent', 'important', 'high'],
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        tags: 'urgent,important,high',
      });
    });

    it('should filter out empty arrays', () => {
      const params = {
        status: 'active',
        tags: [],
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        status: 'active',
      });
    });
  });

  describe('cleanObject', () => {
    it('should remove undefined values', () => {
      const obj = {
        name: 'John',
        email: undefined,
        phone: '555-1234',
      };
      const result = cleanObject(obj);
      expect(result).toEqual({
        name: 'John',
        phone: '555-1234',
      });
    });

    it('should remove null values', () => {
      const obj = {
        name: 'John',
        email: null,
        phone: '555-1234',
      };
      const result = cleanObject(obj);
      expect(result).toEqual({
        name: 'John',
        phone: '555-1234',
      });
    });

    it('should remove empty strings', () => {
      const obj = {
        name: 'John',
        email: '',
        phone: '555-1234',
      };
      const result = cleanObject(obj);
      expect(result).toEqual({
        name: 'John',
        phone: '555-1234',
      });
    });

    it('should keep boolean and numeric values', () => {
      const obj = {
        name: 'John',
        count: 5,
        active: true,
      };
      const result = cleanObject(obj);
      expect(result).toEqual({
        name: 'John',
        count: 5,
        active: true,
      });
    });

    it('should clean nested objects', () => {
      const obj = {
        name: 'John',
        address: {
          city: 'NYC',
          zip: '',
          state: undefined,
        },
      };
      const result = cleanObject(obj);
      expect(result).toEqual({
        name: 'John',
        address: {
          city: 'NYC',
        },
      });
    });
  });

  describe('formatDate', () => {
    it('should format Date object to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should convert string dates to ISO format', () => {
      const dateStr = '2024-01-15T10:30:00Z';
      const result = formatDate(dateStr);
      expect(result).toBe('2024-01-15T10:30:00.000Z');
    });
  });

  describe('generateWebhookSecret', () => {
    it('should generate 32-character alphanumeric string', () => {
      const secret = generateWebhookSecret();
      expect(secret).toHaveLength(32);
      expect(/^[A-Za-z0-9]+$/.test(secret)).toBe(true);
    });

    it('should generate unique secrets', () => {
      const secret1 = generateWebhookSecret();
      const secret2 = generateWebhookSecret();
      expect(secret1).not.toBe(secret2);
    });
  });

  describe('simplifyResponse', () => {
    it('should remove HAL _links from response', () => {
      const response = {
        id: 123,
        name: 'Test',
        _links: {
          self: { href: '/test/123' },
        },
      };
      const result = simplifyResponse(response);
      expect(result).toEqual({
        id: 123,
        name: 'Test',
      });
    });

    it('should extract and flatten _embedded data', () => {
      const response = {
        id: 123,
        _embedded: {
          conversations: [{ id: 1 }, { id: 2 }],
        },
        _links: {},
      };
      const result = simplifyResponse(response);
      expect(result).toEqual({
        id: 123,
        conversations: [{ id: 1 }, { id: 2 }],
      });
    });

    it('should handle response without HAL metadata', () => {
      const response = {
        id: 123,
        name: 'Test',
      };
      const result = simplifyResponse(response);
      expect(result).toEqual({
        id: 123,
        name: 'Test',
      });
    });
  });

  describe('toExecutionData', () => {
    it('should convert single object to execution data array', () => {
      const data = { id: 123, name: 'Test' };
      const result = toExecutionData(data);
      expect(result).toEqual([{ json: { id: 123, name: 'Test' } }]);
    });

    it('should convert array to execution data array', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = toExecutionData(data);
      expect(result).toEqual([{ json: { id: 1 } }, { json: { id: 2 } }]);
    });
  });

  describe('parseCommaSeparated', () => {
    it('should parse comma-separated string to array', () => {
      const result = parseCommaSeparated('a, b, c');
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should filter empty values', () => {
      const result = parseCommaSeparated('a, , b, ');
      expect(result).toEqual(['a', 'b']);
    });

    it('should handle string without commas', () => {
      const result = parseCommaSeparated('single');
      expect(result).toEqual(['single']);
    });
  });

  describe('buildCustomerObject', () => {
    it('should build customer object from params', () => {
      const params = {
        customerEmail: 'test@example.com',
        customerFirstName: 'John',
        customerLastName: 'Doe',
      };
      const result = buildCustomerObject(params);
      expect(result).toEqual({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should include customer ID if present', () => {
      const params = {
        customerId: 12345,
      };
      const result = buildCustomerObject(params);
      expect(result).toEqual({
        id: 12345,
      });
    });

    it('should handle empty params', () => {
      const result = buildCustomerObject({});
      expect(result).toEqual({});
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email format', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('buildThreadBody', () => {
    it('should return HTML text as-is', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = buildThreadBody(html, true);
      expect(result).toBe(html);
    });

    it('should convert plain text newlines to br tags', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const result = buildThreadBody(text, false);
      expect(result).toBe('Line 1<br>Line 2<br>Line 3');
    });
  });

  describe('extractIdFromLink', () => {
    it('should extract ID from HAL link', () => {
      const link = '/v2/conversations/12345';
      const result = extractIdFromLink(link);
      expect(result).toBe(12345);
    });

    it('should return undefined for invalid link', () => {
      const link = '/v2/conversations/';
      const result = extractIdFromLink(link);
      expect(result).toBeUndefined();
    });
  });

  describe('parseWebhookPayload', () => {
    it('should parse webhook payload with all data', () => {
      const payload = {
        event: 'convo.created',
        timestamp: '2024-01-15T10:30:00Z',
        conversation: { id: 123 },
        customer: { id: 456 },
        thread: { id: 789 },
        rating: { rating: 'great' },
      };
      const result = parseWebhookPayload(payload);
      expect(result).toEqual({
        event: 'convo.created',
        timestamp: '2024-01-15T10:30:00Z',
        conversation: { id: 123 },
        customer: { id: 456 },
        thread: { id: 789 },
        rating: { rating: 'great' },
      });
    });

    it('should add timestamp if not present', () => {
      const payload = {
        event: 'convo.created',
      };
      const result = parseWebhookPayload(payload);
      expect(result.event).toBe('convo.created');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('extractEmbeddedData', () => {
    it('should extract embedded data by property name', () => {
      const response = {
        _embedded: {
          conversations: [{ id: 1 }, { id: 2 }],
        },
      };
      const result = extractEmbeddedData(response, 'conversations');
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should return empty array if property not found', () => {
      const response = {
        _embedded: {
          users: [{ id: 1 }],
        },
      };
      const result = extractEmbeddedData(response, 'conversations');
      expect(result).toEqual([]);
    });

    it('should return empty array if no _embedded', () => {
      const response = {
        id: 123,
      };
      const result = extractEmbeddedData(response, 'conversations');
      expect(result).toEqual([]);
    });
  });
});
