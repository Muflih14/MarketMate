import type {Json} from '@core/types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import RSTable from 'rsuite/Table';

import {DropDownActions, InlineActionsCell} from './actions';
import {CheckCell} from './checked';
import {renderColumns} from './columns';
import {defaultLocale} from './locale';
import type {CheckedTableProps} from './types';

export const SimpleTable = <T extends Json = Json>({
  rowKey = 'id',
  headers = [],
  actions = [],
  height,
  checkedRowKeys,
  setCheckedRowKeys,
  locale = {},
  ...props
}: CheckedTableProps<T>) => {
  const {formatMessage} = useIntl();

  const {data = []} = props;

  const allIds = React.useMemo(() => data.map(item => item[rowKey]), [data, rowKey]);
  const count = React.useMemo(() => data.length, [data]);

  const isSingle = React.useMemo(() => count === 1 && actions.length > 0, [count, actions]);
  const areMany = React.useMemo(() => count > 1 && actions.length > 0, [count, actions]);

  const checkedData = React.useMemo(
    () => data.filter(item => checkedRowKeys.includes(item[rowKey])),
    [data, rowKey, checkedRowKeys],
  );

  return (
    <>
      <RSTable
        {...props}
        className={`simple-table ${props.className ?? ''}`}
        rowKey={rowKey}
        autoHeight={!height}
        height={height}
        wordWrap="break-word"
        locale={{
          emptyMessage: formatMessage(locale.emptyMessage ?? defaultLocale.emptyMessage),
          loading: formatMessage(locale.loading ?? defaultLocale.loading),
        }}
      >
        {renderColumns(headers)}

        {isSingle && (
          <RSTable.Column align="center" flexGrow={2}>
            <RSTable.HeaderCell>{''}</RSTable.HeaderCell>

            <InlineActionsCell dataKey={rowKey} actions={actions} />
          </RSTable.Column>
        )}

        {areMany && (
          <RSTable.Column align="center" flexGrow={1}>
            <RSTable.HeaderCell>
              <button
                className="text-primary-50 button-medium bg-none text-nowrap"
                onClick={() => setCheckedRowKeys(checkedRowKeys.length === count ? [] : allIds)}
                type="button"
              >
                {checkedRowKeys.length === count ? (
                  <FormattedMessage id="table.selection.none" defaultMessage="Unselect all" />
                ) : (
                  <FormattedMessage id="table.selection.all" defaultMessage="Select all" />
                )}
              </button>
            </RSTable.HeaderCell>

            <CheckCell dataKey={rowKey} keys={checkedRowKeys} setKeys={setCheckedRowKeys} />
          </RSTable.Column>
        )}
      </RSTable>

      {areMany && <DropDownActions data={checkedData} actions={actions} count={count} />}
    </>
  );
};
