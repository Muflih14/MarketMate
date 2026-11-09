import type {Json} from '@core/types';
import type React from 'react';
import {FormattedMessage} from 'react-intl';
import Button from 'rsuite/Button';
import ButtonGroup from 'rsuite/ButtonGroup';
import Dropdown from 'rsuite/Dropdown';
import Popover from 'rsuite/Popover';
import RSTable, {type CellProps} from 'rsuite/Table';
import Whisper, {type WhisperProps} from 'rsuite/Whisper';

import {Icon, IconName} from '../icon';
import type {TableAction, TableData} from './types';

type ActionButtonProps<T extends Json = Json> = {
  as?: string;
  action: TableAction<T>;
  data: TableData<T>[];
  disabled?: boolean;
};

type BottomProps<T extends Json = Json> = {
  data: TableData<T>[];
  actions?: TableAction<T>[];
  count: number;
};

type InlineProps<T extends Json = Json> = CellProps<T> & {
  dataKey?: string;
  actions?: TableAction<T>[];
};

const bold = (chunks: React.ReactNode) => (
  <span className="text-primary body-small-bold me-1">{chunks}</span>
);

const renderActions = <T extends Json = Json>(
  data: TableData<T>[],
  actions: TableAction<T>[],
): WhisperProps['speaker'] => {
  const speaker: WhisperProps['speaker'] = ({onClose, left, top, className}, ref) => (
    <Popover ref={ref} className={className} style={{left, top}} full arrow={false}>
      <Dropdown.Menu>
        {actions.map(action => (
          <Dropdown.Item
            key={action.id}
            onClick={() => {
              onClose?.();
              action.onClick(data);
            }}
          >
            {!!action.icon && <Icon name={action.icon} className="me-2" />}
            {action.title}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Popover>
  );

  return speaker;
};

export const ActionButton = <T extends Json = Json>({
  as = 'button',
  action,
  data,
  ...props
}: ActionButtonProps<T>) => (
  <Button
    {...props}
    appearance={as === 'link' ? 'link' : 'primary'}
    className={as === 'link' ? `me-2 p-0 ${action.className ?? ''}` : action.className}
    startIcon={!!action.icon && <Icon name={action.icon} />}
    onClick={() => action.onClick(data)}
  >
    {action.title}
  </Button>
);

export const DropDownActions = <T extends Json = Json>({
  data = [],
  actions = [],
  count = 0,
}: BottomProps<T>) => {
  if (data.length === 0 || actions.length === 0 || count < 2) {
    return;
  }

  return (
    <div className="float-end text-end">
      <div className="body-small my-3">
        <FormattedMessage
          id="table.selection.count"
          defaultMessage="<b>{val} of {count}</b> items selected"
          values={{val: data.length, count, b: bold}}
        />
      </div>

      <Whisper placement="bottomStart" trigger="click" speaker={renderActions(data, actions)}>
        <Button appearance="primary" disabled={data.length === 0}>
          <Icon name={IconName.DropDown} size="md" className="me-1" />
          <FormattedMessage id="app.common.action" defaultMessage="Action" />
        </Button>
      </Whisper>
    </div>
  );
};

export const InlineActionsCell = <T extends Json = Json>({
  rowData = {} as TableData<T>,
  actions = [],
  ...props
}: InlineProps<T>) => {
  if (actions.length === 0) {
    return;
  }

  return (
    <RSTable.Cell {...props} className="d-print-none">
      <ButtonGroup>
        {actions.map(action => (
          <ActionButton key={action.id} as="link" action={action} data={[rowData]} />
        ))}
      </ButtonGroup>
    </RSTable.Cell>
  );
};
