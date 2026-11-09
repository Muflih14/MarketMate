import type {ExportableValue, FormBase, FormOption, FormValue} from '@core/types';
import {downloadCSV} from '@core/utils/csv';
import {formatDay} from '@core/utils/dates';
import isDate from 'lodash-es/isDate';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Button from 'rsuite/Button';
import Stack from 'rsuite/Stack';

import {AlertIcon} from '../../alert-icon';
import type {CompleteProps} from './types';

const parseValue = (v: FormValue): ExportableValue => {
  if ((v as FormOption)?.label) {
    const o = v as FormOption;
    return o.label?.toString();
  }
  if ((v as File)?.name) {
    const f = v as File;
    return f.name;
  }
  if (Array.isArray(v)) {
    return v.map(parseValue).join(',');
  }
  const vv = v as Exclude<FormValue, FormOption | File | FormValue[]>;
  return isDate(vv) ? formatDay(vv) : vv;
};

const downloadFile = <T extends FormBase>(records: T[], headers: (keyof T)[], filename: string) => {
  const rows = [
    headers as ExportableValue[],
    ...records.map(item => headers.map(header => parseValue(item[header] as FormValue))),
  ];

  downloadCSV(rows, filename);
};

export const Complete = <T extends FormBase>({
  message,
  reset,
  resetLabel,
  headers,
  records,
  filename,
}: CompleteProps<T>) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const downloadReport = () => {
    setIsProcessing(true);
    downloadFile(records, headers, filename);
    setIsProcessing(false);
  };

  return (
    <Stack direction="column" spacing={16} className="my-5">
      <Stack.Item>
        <AlertIcon size="large" mode="success" />
      </Stack.Item>

      <Stack.Item>
        <h2>
          <FormattedMessage id="app.common.success" defaultMessage="Success" />
        </h2>
      </Stack.Item>

      <Stack.Item>
        <p>
          {message ?? (
            <FormattedMessage
              id="app.common.records.created-new"
              defaultMessage="Records registered successfully"
            />
          )}
        </p>
      </Stack.Item>

      <Stack.Item>
        <Button appearance="primary" onClick={reset} disabled={isProcessing}>
          {resetLabel ?? (
            <FormattedMessage
              id="app.common.records.create-new"
              defaultMessage="Create New Records"
            />
          )}
        </Button>
      </Stack.Item>

      <Stack.Item>
        <Button
          appearance="ghost"
          className="border-0"
          onClick={downloadReport}
          loading={isProcessing}
        >
          <FormattedMessage id="app.common.report.download" defaultMessage="Download report" />
        </Button>
      </Stack.Item>
    </Stack>
  );
};
