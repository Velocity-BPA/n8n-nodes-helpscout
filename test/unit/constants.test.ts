/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  CONVERSATION_STATUSES,
  CONVERSATION_TYPES,
  THREAD_TYPES,
  SORT_FIELDS,
  SORT_ORDERS,
  WEBHOOK_EVENTS,
  REPORT_TYPES,
  PHONE_TYPES,
  EMAIL_TYPES,
  GENDERS,
  PAYLOAD_VERSIONS,
  BASE_URL,
  RESOURCES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../../nodes/HelpScout/constants/constants';

describe('Constants', () => {
  describe('CONVERSATION_STATUSES', () => {
    it('should have expected status options', () => {
      expect(CONVERSATION_STATUSES).toBeDefined();
      expect(Array.isArray(CONVERSATION_STATUSES)).toBe(true);
      expect(CONVERSATION_STATUSES.length).toBeGreaterThan(0);

      const statusValues = CONVERSATION_STATUSES.map((s) => s.value);
      expect(statusValues).toContain('active');
      expect(statusValues).toContain('pending');
      expect(statusValues).toContain('closed');
      expect(statusValues).toContain('spam');
    });
  });

  describe('CONVERSATION_TYPES', () => {
    it('should have expected type options', () => {
      expect(CONVERSATION_TYPES).toBeDefined();
      expect(Array.isArray(CONVERSATION_TYPES)).toBe(true);

      const typeValues = CONVERSATION_TYPES.map((t) => t.value);
      expect(typeValues).toContain('email');
      expect(typeValues).toContain('chat');
      expect(typeValues).toContain('phone');
    });
  });

  describe('THREAD_TYPES', () => {
    it('should have expected thread type options', () => {
      expect(THREAD_TYPES).toBeDefined();
      expect(Array.isArray(THREAD_TYPES)).toBe(true);

      const threadValues = THREAD_TYPES.map((t) => t.value);
      expect(threadValues).toContain('customer');
      expect(threadValues).toContain('message');
      expect(threadValues).toContain('note');
    });
  });

  describe('SORT_FIELDS', () => {
    it('should have expected sort field options', () => {
      expect(SORT_FIELDS).toBeDefined();
      expect(Array.isArray(SORT_FIELDS)).toBe(true);

      const sortValues = SORT_FIELDS.map((s) => s.value);
      expect(sortValues).toContain('createdAt');
      expect(sortValues).toContain('modifiedAt');
    });
  });

  describe('SORT_ORDERS', () => {
    it('should have asc and desc options', () => {
      expect(SORT_ORDERS).toBeDefined();
      expect(Array.isArray(SORT_ORDERS)).toBe(true);

      const orderValues = SORT_ORDERS.map((o) => o.value);
      expect(orderValues).toContain('asc');
      expect(orderValues).toContain('desc');
    });
  });

  describe('WEBHOOK_EVENTS', () => {
    it('should have expected webhook event options', () => {
      expect(WEBHOOK_EVENTS).toBeDefined();
      expect(Array.isArray(WEBHOOK_EVENTS)).toBe(true);
      expect(WEBHOOK_EVENTS.length).toBeGreaterThan(0);

      const eventValues = WEBHOOK_EVENTS.map((e) => e.value);
      expect(eventValues).toContain('convo.created');
      expect(eventValues).toContain('convo.assigned');
      expect(eventValues).toContain('customer.created');
    });
  });

  describe('REPORT_TYPES', () => {
    it('should have expected report type options', () => {
      expect(REPORT_TYPES).toBeDefined();
      expect(Array.isArray(REPORT_TYPES)).toBe(true);

      const reportValues = REPORT_TYPES.map((r) => r.value);
      expect(reportValues).toContain('company');
      expect(reportValues).toContain('conversations');
      expect(reportValues).toContain('productivity');
      expect(reportValues).toContain('happiness');
    });
  });

  describe('PHONE_TYPES', () => {
    it('should have expected phone type options', () => {
      expect(PHONE_TYPES).toBeDefined();
      expect(Array.isArray(PHONE_TYPES)).toBe(true);

      const phoneValues = PHONE_TYPES.map((p) => p.value);
      expect(phoneValues).toContain('work');
      expect(phoneValues).toContain('home');
      expect(phoneValues).toContain('mobile');
    });
  });

  describe('EMAIL_TYPES', () => {
    it('should have expected email type options', () => {
      expect(EMAIL_TYPES).toBeDefined();
      expect(Array.isArray(EMAIL_TYPES)).toBe(true);

      const emailValues = EMAIL_TYPES.map((e) => e.value);
      expect(emailValues).toContain('work');
      expect(emailValues).toContain('home');
    });
  });

  describe('GENDERS', () => {
    it('should have expected gender options', () => {
      expect(GENDERS).toBeDefined();
      expect(Array.isArray(GENDERS)).toBe(true);

      const genderValues = GENDERS.map((g) => g.value);
      expect(genderValues).toContain('male');
      expect(genderValues).toContain('female');
    });
  });

  describe('PAYLOAD_VERSIONS', () => {
    it('should have v1 and v2 options', () => {
      expect(PAYLOAD_VERSIONS).toBeDefined();
      expect(Array.isArray(PAYLOAD_VERSIONS)).toBe(true);

      const versionValues = PAYLOAD_VERSIONS.map((v) => v.value);
      expect(versionValues).toContain('v1');
      expect(versionValues).toContain('v2');
    });
  });

  describe('BASE_URL', () => {
    it('should be the Help Scout API base URL', () => {
      expect(BASE_URL).toBe('https://api.helpscout.net/v2');
    });
  });

  describe('RESOURCES', () => {
    it('should have expected resource constants', () => {
      expect(RESOURCES).toBeDefined();
      expect(typeof RESOURCES).toBe('object');

      expect(RESOURCES.CONVERSATION).toBe('conversation');
      expect(RESOURCES.CUSTOMER).toBe('customer');
      expect(RESOURCES.MAILBOX).toBe('mailbox');
      expect(RESOURCES.USER).toBe('user');
      expect(RESOURCES.TAG).toBe('tag');
      expect(RESOURCES.WEBHOOK).toBe('webhook');
      expect(RESOURCES.THREAD).toBe('thread');
      expect(RESOURCES.ORGANIZATION).toBe('organization');
      expect(RESOURCES.WORKFLOW).toBe('workflow');
      expect(RESOURCES.REPORT).toBe('report');
    });
  });

  describe('Pagination Constants', () => {
    it('should have correct default page size', () => {
      expect(DEFAULT_PAGE_SIZE).toBe(50);
    });

    it('should have correct max page size', () => {
      expect(MAX_PAGE_SIZE).toBe(100);
    });
  });
});
