import type {DictOf, ExportableValue, IdValue, Json} from '@core/types';
import {now} from '@core/utils/dates';
import flatten from 'lodash-es/flatten';

import type {TableColumn, TableData, TableTab} from './types';
import {getCellValue} from './utils';

type Content = ExportableValue[][];
type Row = DictOf<ExportableValue>;
type RowWithChildren = Row & {children?: Row[]};

type FileHeaders<T extends Json = Json> = Record<IdValue, TableColumn<T>[]>;
type FileRows = Record<IdValue, Row[]>;
type FileContent = Record<IdValue, Content>;

export const parseRow = <T extends Json = Json>(
  rowData: TableData<T>,
  headers: TableColumn<T>[],
): Row => {
  const row: Row = {};

  for (const header of headers.filter(h => !h.omit)) {
    row[header.dataKey] = getCellValue(rowData, header);
  }

  return row;
};

// -----------------------------------------------------------------------------
// Helpers for flat tables
// -----------------------------------------------------------------------------

type FlatOptions<T extends Json = Json> = {
  headers: TableColumn<T>[];
  subHeaders?: TableColumn<T>[];
  subTab?: TableColumn<T>;
};

const getFlatHeaders = <T extends Json = Json>({
  headers,
  subTab,
  subHeaders,
}: FlatOptions<T>): TableColumn<T>[] => {
  const list: TableColumn<T>[] = headers.filter(header => !header.omit);
  const subTabList = subTab ? getFlatHeaders({headers: [subTab]}) : [];
  const subList = subHeaders?.length ? getFlatHeaders({headers: subHeaders}) : [];

  return [...list, ...subTabList, ...subList];
};

export const parseFlatRows = <T extends Json = Json>(
  data: readonly TableData<T>[],
  {headers, subTab, subHeaders}: FlatOptions<T>,
): Row[] => {
  const subColumns = subTab && subHeaders ? [subTab, ...subHeaders] : subHeaders;

  const rows = (data ?? []).map(record => {
    const row: RowWithChildren = parseRow(record, headers);

    if (subColumns?.length && record.children) {
      const children = record.children;

      const subRows = [];
      if (subTab) {
        // each children entry is a dictionary
        for (const key of Object.keys(children)) {
          subRows.push(
            ...children[key].map((child: TableData<T>) => ({
              [subTab.dataKey]: key,
              ...child,
            })),
          );
        }
      } else {
        subRows.push(...children);
      }

      row.children = parseFlatRows(subRows, {headers: subColumns});
    }

    return row;
  });

  if (subColumns?.length) {
    return flatten(
      rows.map(row => {
        const {children = [], ...rowData} = row;
        return children.map(child => ({...rowData, ...child}));
      }),
    );
  }

  return rows;
};

// -----------------------------------------------------------------------------
// Helpers for tabbed tables
// -----------------------------------------------------------------------------

type TabbedOptions<T extends Json = Json> = {
  headers: TableColumn<T>[];
  subTabs: TableTab<T>[];
};

const getTabbedHeaders = <T extends Json = Json>({
  headers,
  subTabs,
}: TabbedOptions<T>): FileHeaders<T> => {
  const list: TableColumn<T>[] = getFlatHeaders({headers});

  const tabs: FileHeaders<T> = {};
  for (const tab of subTabs) {
    tabs[tab.key] = [...list, ...getFlatHeaders({headers: tab.headers})];
  }
  return tabs;
};

export const parseTabbedRows = <T extends Json = Json>(
  data: readonly TableData<T>[],
  {headers, subTabs}: TabbedOptions<T>,
): FileRows => {
  const tabs: FileRows = {};

  if (!subTabs.length) {
    return tabs;
  }

  const rows = (data ?? []).map(record => {
    const row: TableData = parseRow(record, headers);
    row.children = {};

    for (const tab of subTabs) {
      row.children[tab.key] = parseFlatRows(record.children?.[tab.key], {
        headers: tab.headers,
      });
    }

    return row;
  });

  for (const tab of subTabs) {
    tabs[tab.key] = flatten(
      rows.map(row => {
        const {children = {}, ...rowData} = row;
        return children[tab.key].map((child: TableData) => ({
          ...rowData,
          ...child,
        }));
      }),
    );
  }

  return tabs;
};

// -----------------------------------------------------------------------------
// Helpers for all tables
// -----------------------------------------------------------------------------

type Options<T extends Json = Json> = {
  filename?: string;
  headers: TableColumn<T>[];
  subHeaders?: TableColumn<T>[];
  subTabs?: TableTab<T>[];
  subTab?: TableColumn<T>;
};

const getContent = <T extends Json = Json>(data: Row[], headers: TableColumn<T>[]): Content => {
  return [
    // header row
    headers.map(header => header.label as string),
    // rows
    ...data.map(row => headers.map(header => row[header.dataKey])),
  ];
};

export const getFileContent = <T extends Json = Json>(
  data: readonly TableData<T>[],
  opts: Options<T>,
): FileContent => {
  const {filename = '', subTabs} = opts;
  const timestamp = now();
  const tabs: FileContent = {};

  if (!subTabs?.length) {
    const key = `${filename} - ${timestamp}`;
    const rows = parseFlatRows(data, opts);
    if (rows.length > 0) {
      tabs[key] = getContent(rows, getFlatHeaders(opts));
    }
    return tabs;
  }

  const headers = getTabbedHeaders(opts as TabbedOptions<T>);
  const rows = parseTabbedRows(data, opts as TabbedOptions<T>);

  for (const tab of subTabs) {
    if (rows[tab.key].length > 0) {
      const key = `${filename} - ${tab.label as string} - ${timestamp}`;
      tabs[key] = getContent(rows[tab.key], headers[tab.key]);
    }
  }

  return tabs;
};
