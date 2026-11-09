import isNil from 'lodash-es/isNil';

import type {ExportableValue} from '../types';
import {downloadFile} from './request';

type Content = ExportableValue[][];

/**
 * Simple safari detection based on user agent test
 */
const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const wrapCol = (column: ExportableValue, ec: string) => {
  if (typeof column !== 'string') {
    return column;
  }

  return `${ec}${column.replaceAll(ec, ec + ec)}${ec}`;
};

const toCSV = (data: Content, separator = ',', enclosingCharacter = '"') => {
  return data
    .filter(e => e)
    .map(row =>
      row
        .map(column => (isNil(column) ? '' : column))
        .map(column => wrapCol(column, enclosingCharacter))
        .join(separator),
    )
    .join('\n');
};

/**
 * Generates CSV file from content and downloads it
 *
 * @param data      File content as array of array of values
 * @param filename  File name
 */
export const downloadCSV = (data: Content, filename: string): void => {
  const content = toCSV(data);
  const type = isSafari() ? 'application/csv' : 'text/csv';

  const blob = new Blob([content], {type});

  downloadFile(blob, filename);
};
