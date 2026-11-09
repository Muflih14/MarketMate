import type {Json} from '@core/types';
import {downloadCSV} from '@core/utils/csv';
import React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Button from 'rsuite/Button';
import useToaster from 'rsuite/useToaster';

import {Icon, IconName} from '../icon';
import {Toast} from '../toast';
import {ToastMode, ToastPlacement} from '../toast/types';
import {getFileContent} from './export-utils';
import type {TableProps} from './types';

type Props<T extends Json = Json> = Omit<TableProps<T>, 'setCheckedRowKeys'> & {
  disabled?: boolean;
};

const messages = defineMessages({
  success: {
    id: 'table.button.export.success',
    defaultMessage: 'Records exported successfully.',
  },
  empty: {
    id: 'table.button.export.empty',
    defaultMessage: 'There are no records to export.',
  },
  error: {
    id: 'toast.default.error',
    defaultMessage: 'Operation failed. Please try again later.',
  },
});

export const ExportButton = <T extends Json = Json>({
  disabled = false,
  data = [],
  headers,
  subHeaders,
  subTabs,
  subTab,
  exportFileName,
}: Props<T>) => {
  const {formatMessage} = useIntl();
  const {push} = useToaster();

  const notify = (content: React.ReactNode, mode: ToastMode) => {
    push(
      <Toast closable mode={mode}>
        {content}
      </Toast>,
      {
        placement: ToastPlacement.TopEnd,
        duration: 6000,
      },
    );
  };

  const [isWorking, setIsWorking] = React.useState(false);

  const handleExport = async () => {
    setIsWorking(true);

    let downloaded = false;
    try {
      if (data.length > 0) {
        const files = getFileContent(data, {
          headers,
          subHeaders,
          subTabs,
          subTab,
          filename: exportFileName ?? 'export',
        });

        for (const filename of Object.keys(files)) {
          downloadCSV(files[filename], filename);
          downloaded = true;
        }
      }

      if (downloaded) {
        notify(formatMessage(messages.success), ToastMode.Success);
      } else {
        notify(formatMessage(messages.empty), ToastMode.Warning);
      }
    } catch (err) {
      notify(formatMessage(messages.error), ToastMode.Error);
      console.error(err);
    }
    setIsWorking(false);
  };

  return (
    <Button
      appearance="ghost"
      disabled={disabled || isWorking}
      loading={isWorking}
      onClick={handleExport}
      startIcon={<Icon name={IconName.Export} />}
    >
      <FormattedMessage id="table.button.export.label" defaultMessage="Export" />
    </Button>
  );
};
