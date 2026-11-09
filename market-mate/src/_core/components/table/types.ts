import type {ExportableValue, IdValue, Json} from '@core/types';
import type React from 'react';
import type {MessageDescriptor} from 'react-intl';
import type {ColumnProps, TableProps as RSTableProps} from 'rsuite/Table';

import type {FilterButtonProps} from '../filter-button/types';

export type FilterOptions = {
  value: IdValue;
  label: string;
};

type RenderFn<T extends Json = Json> = (rowData: T, dataKey: string) => React.ReactNode;

type ToValueFn<T extends Json = Json> = (rowData: T, dataKey: string) => ExportableValue;

interface TableColumnProps<T extends Json = Json> {
  props?: ColumnProps<T>;
  // method used to render column in screen
  render?: RenderFn<T>;
  // method used to extract exportable value
  toValue?: ToValueFn<T>;
  // hidden in screen
  hidden?: boolean;
  // omitted in export file
  omit?: boolean;
  // indicates methods used to render and to export the column value
  valueType?: 'date' | 'time' | 'date-time' | 'number' | string;
}

export type PreTableColumn<T extends Json = Json> = TableColumnProps<T> & {
  key: string;
  message: MessageDescriptor;
};

export type PreTableTabColumn<
  K extends IdValue = IdValue,
  T extends Json = Json,
> = PreTableColumn<T> & {
  messages?: Record<K, MessageDescriptor>;
};

export type TableColumn<T extends Json = Json> = TableColumnProps<T> & {
  dataKey: string;
  label: React.ReactNode;
};

export type TableTab<T extends Json = Json> = {
  key: IdValue;
  label: React.ReactNode;
  icon?: string;
  rowKey?: string;
  headers: TableColumn<T>[];
};

export type TableData<T extends Json = Json> = T & {
  searchableTerms?: string[];
  filterValue?: Record<IdValue, boolean>;
};

export type TableAction<T extends Json = Json> = {
  id: string;
  title: string;
  icon?: string;
  onClick: (data: TableData<T>[]) => void;
  className?: string;
};

export type TableLocale = {
  emptyMessage: MessageDescriptor;
  loading: MessageDescriptor;
  more: MessageDescriptor;
  prev: MessageDescriptor;
  next: MessageDescriptor;
  first: MessageDescriptor;
  last: MessageDescriptor;
  limit: MessageDescriptor;
  total: MessageDescriptor;
  skip: MessageDescriptor;
};

export type TableProps<T extends Json = Json> = RSTableProps<TableData<T>, string> & {
  // display as simple table
  simple?: boolean;
  // display options
  rowKey?: string;
  rowHeight?: number | ((rowData?: TableData<T>) => number);
  headers: TableColumn<T>[];
  // nested table
  subRowKey?: string;
  subHeaders?: TableColumn<T>[];
  subTab?: TableColumn<T>;
  subTabs?: TableTab<T>[];
  // pagination
  hidePagination?: boolean;
  // toolbar: search
  hideSearch?: boolean;
  searchChildren?: boolean;
  // toolbar: filter
  hideFilter?: boolean;
  defaultFilterValue?: IdValue;
  filterOptions?: FilterOptions[];
  filterChildren?: boolean;
  filterProps?: FilterButtonProps;
  // toolbar: checked actions
  omitCheck?: boolean;
  checkedActions?: TableAction<T>[];
  checkedActionsChildren?: (selected: TableData<T>[]) => React.ReactNode;
  // toolbar: export
  hideExport?: boolean;
  exportFileName?: string;
  // toolbar: other actions
  actions?: TableAction<T>[];
  filterPlaceholder?: string;
  // messages
  locale?: Partial<TableLocale>;
};

export type CheckedTableProps<T extends Json = Json> = TableProps<T> & {
  checkedRowKeys: IdValue[];
  setCheckedRowKeys: (values: IdValue[]) => void;
};

export type PaginationProps = {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (val: number) => void;
  onLimitChange: (val: number) => void;
  // messages
  locale?: Partial<TableLocale>;
};
