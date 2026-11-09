import {defineMessages} from 'react-intl';

import type {TableLocale} from './types';

export const defaultLocale: TableLocale = defineMessages({
  // table
  emptyMessage: {
    id: 'table.empty',
    defaultMessage: 'No records found',
  },
  loading: {
    id: 'table.loading',
    defaultMessage: 'Loading records',
  },

  // pagination
  more: {
    id: 'table.pagination.more',
    defaultMessage: 'more',
  },
  prev: {
    id: 'table.pagination.prev',
    defaultMessage: 'prev',
  },
  next: {
    id: 'table.pagination.next',
    defaultMessage: 'next',
  },
  first: {
    id: 'table.pagination.first',
    defaultMessage: 'first',
  },
  last: {
    id: 'table.pagination.last',
    defaultMessage: 'last',
  },
  limit: {
    id: 'table.pagination.limit',
    defaultMessage: 'records / page',
  },
  total: {
    id: 'table.pagination.total:',
    defaultMessage: 'Total records:',
  },
  skip: {
    id: 'table.pagination.skip',
    defaultMessage: 'Go to',
  },
});
