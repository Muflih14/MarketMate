import type {Json} from '@core/types';
import {formatDay, formatDayHour, formatHour} from '@core/utils/dates';
import getProperty from 'lodash-es/get';
import orderBy from 'lodash-es/orderBy';
import type {SortType} from 'rsuite/Table';

import type {TableColumn, TableData} from './types';

export const defaultHeight = 46;

export const getValue = (rowData: TableData, dataKey: string) => getProperty(rowData, dataKey);

export const getCellValue = <T extends Json = Json>(
  rowData: TableData<T>,
  header: Pick<TableColumn<T>, 'dataKey' | 'valueType' | 'toValue'>,
) => {
  if (header.toValue) {
    return header.toValue(rowData, header.dataKey);
  }

  const value = getValue(rowData, header.dataKey);

  if (header.valueType === 'date') {
    return formatDay(value);
  }

  if (header.valueType === 'time') {
    return formatHour(value);
  }

  if (header.valueType === 'date-time') {
    return formatDayHour(value);
  }

  return value;
};

export const sortData = <T extends Json = Json>(
  sortColumn?: string,
  sortType?: SortType,
  data: readonly TableData<T>[] = [],
  headers: TableColumn<T>[] = [],
): TableData<T>[] => {
  if (!sortColumn) {
    return [...data];
  }

  const column = headers.find(header => header.dataKey === sortColumn);
  if (!column) {
    return [...data];
  }

  const iteratee = (rowData: TableData<T>) => getCellValue(rowData, column);

  return orderBy([...data], iteratee, [sortType ?? 'asc']);
};

export const rowExpandedHeight = <T extends Json = Json>(rowData?: TableData<T>) => {
  if (!rowData?.children) {
    return 0;
  }

  let rows = 0;
  if (Array.isArray(rowData.children)) {
    // On single type of child
    rows = rowData.children.length + 1; // include header
  } else {
    // It is a tabbed child
    for (const key of Object.keys(rowData.children)) {
      rows = Math.max(rows, rowData.children[key].length);
    }
    rows += 2; // include tab and header
  }

  return rows * defaultHeight;
};
