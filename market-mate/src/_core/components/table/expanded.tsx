import type {DictOf, IdValue, Json} from '@core/types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import IconButton from 'rsuite/IconButton';
import Message from 'rsuite/Message';
import Nav from 'rsuite/Nav';
import Panel from 'rsuite/Panel';
import RSTable, {type CellProps, type SortType} from 'rsuite/Table';

import {Icon, IconName} from '../icon';
import {renderColumns} from './columns';
import type {TableColumn, TableData, TableTab} from './types';
import {defaultHeight, sortData} from './utils';

type ExpandedCellProps<T extends Json = Json> = CellProps<TableData<T>> & {
  setKeys: (values: IdValue[]) => void;
  keys: IdValue[];
};

type ExpandedTableProps<T extends Json = Json> = {
  data: TableData<T>[];
  headers?: TableColumn<T>[];
  rowKey?: string;
};

type ExpandedTabbedTablesProps<T extends Json = Json> = {
  tabs: TableTab<T>[];
  data: Record<IdValue, TableData<T>[]>;
};

export const ExpandHeader = () => <Icon name={IconName.More} />;

export const ExpandCell = <T extends Json = Json>({
  rowData = {} as TableData<T>,
  dataKey = 'id',
  keys,
  setKeys,
  ...props
}: ExpandedCellProps<T>) => {
  const cellId = React.useMemo(() => (rowData ? rowData[dataKey] : ''), [rowData, dataKey]);
  const isOpen = React.useMemo(() => keys.some((key: IdValue) => key === cellId), [cellId, keys]);

  const hasChildren = React.useMemo(() => {
    if (!rowData.children) {
      return false;
    }

    if (Array.isArray(rowData.children)) {
      return rowData.children?.length;
    }

    const children = rowData.children as DictOf<TableData[]>;
    return Object.values(children).some((val: TableData[]) => val?.length);
  }, [rowData.children]);

  const handleClick = React.useCallback(() => {
    if (isOpen) {
      setKeys(keys.filter(key => key !== cellId));
    } else {
      setKeys([...keys, cellId]);
    }
  }, [isOpen, cellId, keys, setKeys]);

  if (!hasChildren) {
    return <RSTable.Cell {...props} />;
  }

  return (
    <RSTable.Cell {...props} style={{padding: 5}}>
      <IconButton
        appearance="subtle"
        onClick={handleClick}
        icon={<Icon name={isOpen ? IconName.Minus : IconName.Plus} />}
      />
    </RSTable.Cell>
  );
};

export const ExpandTable = <T extends Json = Json>({
  rowKey = 'id',
  data = [],
  headers = [],
}: ExpandedTableProps<T>) => {
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortType, setSortType] = React.useState<SortType>();
  const sortedData = React.useMemo(
    () => sortData(sortColumn, sortType, data, headers),
    [data, headers, sortColumn, sortType],
  );

  const handleSortColumn = React.useCallback((columnKey: string, dir?: SortType) => {
    setSortColumn(columnKey);
    setSortType(dir ?? 'asc');
  }, []);

  if (!data?.length) {
    return (
      <Message type="warning">
        <FormattedMessage id="app.common.data.empty" defaultMessage="No available data" />
      </Message>
    );
  }

  return (
    <Panel bodyFill>
      <RSTable
        autoHeight
        headerHeight={defaultHeight}
        rowHeight={defaultHeight}
        data={sortedData}
        rowKey={rowKey}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
      >
        {renderColumns(headers)}
      </RSTable>
    </Panel>
  );
};

export const ExpandTabbedTables = <T extends Json = Json>({
  tabs = [],
  data = {},
}: ExpandedTabbedTablesProps<T>) => {
  const [activeKey, setActiveKey] = React.useState<IdValue | undefined>(tabs[0]?.key);
  const activeTab = tabs.find(tab => tab.key === activeKey) ?? tabs[0];

  const activateTab = React.useCallback((eventKey: string | number | undefined) => {
    if (eventKey != null) {
      setActiveKey(eventKey);
    }
  }, []);

  if (!tabs?.length || !activeTab) {
    return (
      <Message type="warning">
        <FormattedMessage id="app.common.data.empty" defaultMessage="No available data" />
      </Message>
    );
  }

  return (
    <Panel bodyFill>
      <Nav
        appearance="subtle"
        activeKey={activeTab.key.toString()}
        onSelect={activateTab}
        className="py-2"
      >
        {tabs.map(tab => (
          <Nav.Item key={tab.key} eventKey={tab.key.toString()} icon={<Icon name={tab.icon} />}>
            {tab.label}
          </Nav.Item>
        ))}
      </Nav>

      <ExpandTable
        data={data[activeTab.key]}
        headers={activeTab.headers}
        rowKey={activeTab.rowKey}
      />
    </Panel>
  );
};
