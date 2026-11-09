import type {IdValue, Json} from '@core/types';
import React from 'react';
import {useIntl} from 'react-intl';
import Panel from 'rsuite/Panel';
import RSTable from 'rsuite/Table';

import {CheckCell, CheckHeader} from './checked';
import {renderColumns} from './columns';
import Empty from './empty';
import {ExpandCell, ExpandHeader, ExpandTabbedTables, ExpandTable} from './expanded';
import {defaultLocale} from './locale';
import {Pagination} from './pagination';
import type {CheckedTableProps, TableData, TableTab} from './types';
import {defaultHeight, rowExpandedHeight} from './utils';

const emptyRows: TableData[] = [];

export const ComplexTable = <T extends Json = Json>({
  data = emptyRows as TableData<T>[],
  rowKey = 'id',
  headerHeight = defaultHeight,
  rowHeight = defaultHeight,
  headers,
  subRowKey = 'id',
  subHeaders,
  subTabs,
  subTab,
  omitCheck = false,
  checkedRowKeys,
  setCheckedRowKeys,
  hidePagination = false,
  locale = {},
  ...props
}: CheckedTableProps<T>) => {
  const {formatMessage} = useIntl();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<IdValue[]>([]);
  const [trackedData, setTrackedData] = React.useState(data);
  const [trackedHidden, setTrackedHidden] = React.useState(hidePagination);

  let page = currentPage;
  let size = hidePagination ? data.length : pageSize;

  if (trackedData !== data) {
    setTrackedData(data);
    page = 1;
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    if (hidePagination && pageSize !== data.length) {
      size = data.length;
      setPageSize(data.length);
    }
  }

  if (trackedHidden !== hidePagination) {
    setTrackedHidden(hidePagination);
    if (hidePagination) {
      page = 1;
      size = data.length;
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      if (pageSize !== data.length) {
        setPageSize(data.length);
      }
    }
  }

  const pageData = data.slice((page - 1) * size, page * size);

  const tableHeight = React.useMemo(() => {
    const moreHeight = expandedRowKeys.length ? 400 : 0;
    const rowsHeight =
      typeof rowHeight === 'function'
        ? pageData.reduce((sum, row) => sum + rowHeight(row) + 3, 0)
        : size * (rowHeight + 3);

    return Math.max(rowsHeight + headerHeight + moreHeight, 400);
  }, [headerHeight, rowHeight, size, pageData, expandedRowKeys]);

  const renderRowExpanded = React.useCallback(
    (rowData?: TableData<T>) => {
      let tabs = subTabs;
      if (!tabs?.length && subTab) {
        // the children data is a dictionary but with dynamic tabs
        // assume that the key is the tab label too
        tabs = Object.keys(rowData?.children ?? {}).map(
          key =>
            ({
              key,
              label: `${subTab.label}: ${key}`,
              headers: subHeaders,
            }) as TableTab<T>,
        );
      }

      if (tabs?.length) {
        return <ExpandTabbedTables data={rowData?.children} tabs={tabs} />;
      }

      return <ExpandTable data={rowData?.children} rowKey={subRowKey} headers={subHeaders} />;
    },
    [subRowKey, subHeaders, subTabs, subTab],
  );

  return (
    <Panel bordered className="mt-3" bodyFill>
      <Panel className="data-table-panel">
        <RSTable
          {...props}
          className={`data-table ${props.className ?? ''}`}
          data={pageData}
          expandedRowKeys={expandedRowKeys}
          height={tableHeight}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          renderEmpty={Empty}
          renderRowExpanded={renderRowExpanded}
          rowExpandedHeight={rowExpandedHeight}
          rowKey={rowKey}
          shouldUpdateScroll={false}
          locale={{
            emptyMessage: formatMessage(locale.emptyMessage ?? defaultLocale.emptyMessage),
            loading: formatMessage(locale.loading ?? defaultLocale.loading),
          }}
        >
          {!omitCheck && (
            <RSTable.Column align="center" width={50}>
              <RSTable.HeaderCell style={{padding: 0}}>
                <CheckHeader dataKey={rowKey} data={data} setKeys={setCheckedRowKeys} />
              </RSTable.HeaderCell>

              <CheckCell dataKey={rowKey} keys={checkedRowKeys} setKeys={setCheckedRowKeys} />
            </RSTable.Column>
          )}

          {renderColumns(headers)}

          {(subHeaders?.length || subTabs?.length) && (
            <RSTable.Column align="center" width={50}>
              <RSTable.HeaderCell>
                <ExpandHeader />
              </RSTable.HeaderCell>

              <ExpandCell dataKey={rowKey} keys={expandedRowKeys} setKeys={setExpandedRowKeys} />
            </RSTable.Column>
          )}
        </RSTable>
      </Panel>

      {!hidePagination && (
        <div className="m-3">
          <Pagination
            total={data.length}
            pageSize={size}
            currentPage={page}
            onPageChange={setCurrentPage}
            onLimitChange={setPageSize}
            locale={locale}
          />
        </div>
      )}
    </Panel>
  );
};
