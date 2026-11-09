import type {IdValue, Json} from '@core/types';
import {omitProps} from '@core/utils';
import React from 'react';
import type {SortType} from 'rsuite/Table';

import {ComplexTable} from './table-complex';
import {SimpleTable} from './table-simple';
import {Toolbar} from './toolbar';
import type {TableData, TableProps} from './types';
import {sortData} from './utils';

const toolbarProps = [
  // toolbar: search
  'hideSearch',
  'searchChildren',
  // toolbar: filter
  'hideFilter',
  'defaultFilterValue',
  'filterOptions',
  'filterChildren',
  'filterProps',
  'filterPlaceholder',
  // toolbar: checked actions
  // 'omitCheck', // required by ComplexTable, keep commented
  'checkedActions',
  // toolbar: export
  'hideExport',
  'exportFileName',
  // toolbar: rest of actions
  // 'actions', // required by SimpleTable, keep it commented
];

const TableView = <T extends Json = Json>({
  simple = false,
  data = [],
  onCheckedChange,
  ...props
}: TableProps<T> & {onCheckedChange?: (keys: IdValue[]) => void}) => {
  const [checkedRowKeys, setCheckedRowKeys] = React.useState<IdValue[]>([]);
  const isMounted = React.useRef(false);

  const [sortColumn, setSortColumn] = React.useState<string | undefined>(
    props.sortColumn as string | undefined,
  );
  const [sortType, setSortType] = React.useState<SortType | undefined>(props.sortType);

  const sortedData = React.useMemo(
    () => sortData(sortColumn, sortType, data, props.headers),
    [props.headers, data, sortColumn, sortType],
  );

  const TableComponent = React.useMemo(() => (simple ? SimpleTable : ComplexTable), [simple]);

  const handleSortColumn = React.useCallback((columnKey: string, dir?: SortType) => {
    setSortColumn(columnKey);
    setSortType(dir ?? 'asc');
  }, []);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    onCheckedChange?.(checkedRowKeys);
  }, [checkedRowKeys, onCheckedChange]);

  return (
    <div>
      {simple ? (
        <TableComponent
          {...omitProps(props, toolbarProps)}
          data={sortedData}
          checkedRowKeys={checkedRowKeys}
          setCheckedRowKeys={setCheckedRowKeys}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
        />
      ) : (
        <Toolbar
          {...props}
          data={sortedData}
          checkedRowKeys={checkedRowKeys}
          setCheckedRowKeys={setCheckedRowKeys}
          renderTable={(visibleData: TableData<T>[]) => (
            <TableComponent
              {...omitProps(props, toolbarProps)}
              data={visibleData}
              checkedRowKeys={checkedRowKeys}
              setCheckedRowKeys={setCheckedRowKeys}
              sortColumn={sortColumn}
              sortType={sortType}
              onSortColumn={handleSortColumn}
            />
          )}
        />
      )}
    </div>
  );
};

export default TableView;
