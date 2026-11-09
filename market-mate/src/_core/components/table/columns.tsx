import RSTable, {type ColumnProps, type SortType} from 'rsuite/Table';

import type {Json} from '../../types';
import {DateTimeValue, DateValue, NumberValue, TimeValue} from '../formatted';
import type {TableColumn, TableData} from './types';
import {getValue} from './utils';

type Props<T extends Json = Json> = {
  rowData: TableData<T>;
  header: TableColumn<T>;
};

const defaultHeaderProps: ColumnProps<Json> = {
  width: 150,
  align: 'left',
  resizable: true,
};

const sortIcon = {
  asc: 'fa-solid fa-arrow-down-short-wide',
  desc: 'fa-solid fa-arrow-down-wide-short',
};

const renderSortIcon = (dir?: SortType) => (dir ? <i className={sortIcon[dir]} /> : '');

// Export for testing purposes
export const TableCell = <T extends Json = Json>({rowData, header}: Props<T>) => {
  if (header.render) {
    return header.render(rowData, header.dataKey);
  }

  const value = getValue(rowData, header.dataKey);

  if (header.valueType === 'date') {
    return <DateValue value={value} />;
  }

  if (header.valueType === 'time') {
    return <TimeValue value={value} />;
  }

  if (header.valueType === 'date-time') {
    return <DateTimeValue value={value} inline />;
  }

  if (header.valueType === 'number') {
    return <NumberValue value={value} />;
  }

  return value;
};

export const renderColumns = <T extends Json = Json>(headers: TableColumn<T>[]) =>
  headers
    .filter(header => !header.hidden)
    .map(header => (
      <RSTable.Column key={header.dataKey} {...defaultHeaderProps} {...(header.props ?? {})}>
        <RSTable.HeaderCell renderSortIcon={renderSortIcon}>
          <span className="table-word-wrap">{header.label}</span>
        </RSTable.HeaderCell>

        <RSTable.Cell dataKey={header.dataKey}>
          {(rowData: TableData<T>) => <TableCell rowData={rowData} header={header} />}
        </RSTable.Cell>
      </RSTable.Column>
    ));
