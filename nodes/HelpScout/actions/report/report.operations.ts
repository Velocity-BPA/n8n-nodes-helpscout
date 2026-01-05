/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { helpScoutApiRequest } from '../../transport/HelpScoutClient';
import { buildQueryParams, toExecutionData } from '../../utils/helpers';

/**
 * Build common report query parameters
 */
function buildReportQuery(filters: IDataObject): IDataObject {
  const query: IDataObject = {};

  if (filters.start) {
    query.start = filters.start;
  }

  if (filters.end) {
    query.end = filters.end;
  }

  if (filters.mailboxes) {
    query.mailboxes = filters.mailboxes;
  }

  if (filters.tags) {
    query.tags = filters.tags;
  }

  if (filters.types) {
    query.types = filters.types;
  }

  if (filters.folders) {
    query.folders = filters.folders;
  }

  if (filters.officeHours) {
    query.officeHours = filters.officeHours;
  }

  return query;
}

/**
 * Get company report
 */
export async function getCompanyReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/company',
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get conversations report
 */
export async function getConversationsReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/conversations',
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get productivity report
 */
export async function getProductivityReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/productivity',
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get happiness report
 */
export async function getHappinessReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/happiness',
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get user report
 */
export async function getUserReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as number;
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildQueryParams(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    `/reports/user/${userId}`,
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get chat report
 */
export async function getChatReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/chat',
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get email report
 */
export async function getEmailReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/email',
    {},
    query,
  );

  return toExecutionData(response);
}

/**
 * Get phone report
 */
export async function getPhoneReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index) as IDataObject;
  const query = buildReportQuery(filters);

  const response = await helpScoutApiRequest.call(
    this,
    'GET',
    '/reports/phone',
    {},
    query,
  );

  return toExecutionData(response);
}
