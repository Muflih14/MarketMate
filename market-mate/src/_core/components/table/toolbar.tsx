import type {IdValue, Json, Messages} from '@core/types';
import assign from 'lodash-es/assign';
import isNil from 'lodash-es/isNil';
import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import Button from 'rsuite/Button';
import SelectPicker from 'rsuite/SelectPicker';
import Stack from 'rsuite/Stack';

import {FilterButton} from '../filter-button';
import SearchInput from '../form/search';
import {Icon, IconName} from '../icon';
import {ActionButton} from './actions';
import {ExportButton} from './export-button';
import type {CheckedTableProps, TableData} from './types';

const messages: Messages = defineMessages({
  searchPlaceholder: {
    id: 'table.search.placeholder',
    defaultMessage: 'Search in {count, plural, =0 {0 records} one {one record} other {# records}}',
  },
  filterPlaceholder: {
    id: 'table.filter.placeholder',
    defaultMessage: 'Select option',
  },
  clear: {
    id: 'table.selection.clear',
    defaultMessage: '{count} selected',
  },
});

const handleFilter = <T extends Json = Json>(value: IdValue, item: TableData<T>) => {
  if (isNil(value)) {
    return true;
  }
  return !!item.filterValue?.[value];
};

type Props<T extends Json = Json> = CheckedTableProps<T> & {
  renderTable?: (data: TableData<T>[]) => React.ReactNode;
};

export const Toolbar = <T extends Json = Json>({
  data = [],
  renderTable,
  rowKey = 'id',
  checkedRowKeys = [],
  setCheckedRowKeys,
  hideSearch = false,
  searchChildren = false,
  defaultFilterValue = '',
  filterOptions = [],
  filterChildren = false,
  hideFilter = false,
  hideExport = false,
  actions = [],
  checkedActions = [],
  filterProps = {},
  filterPlaceholder,
  loading = false,
  ...props
}: Props<T>) => {
  const {formatMessage} = useIntl();

  const defaultIsListed =
    filterOptions?.some(option => option.value === defaultFilterValue) ?? false;
  const [filterValue, setFilterValue] = React.useState<IdValue | null>(
    defaultIsListed ? defaultFilterValue : null,
  );
  const [appliedDefault, setAppliedDefault] = React.useState(defaultFilterValue);
  const [appliedListed, setAppliedListed] = React.useState(defaultIsListed);
  const [searchText, setSearchText] = React.useState('');

  if (defaultFilterValue !== appliedDefault || defaultIsListed !== appliedListed) {
    setAppliedDefault(defaultFilterValue);
    setAppliedListed(defaultIsListed);
    if (defaultIsListed) {
      setFilterValue(defaultFilterValue);
    }
  }

  const applyFilter = React.useCallback(
    (records: TableData<T>[]) => {
      if (!filterValue) {
        return records;
      }

      const filterer = (item: TableData<T>) => handleFilter(filterValue, item);

      let list = records;
      if (filterChildren) {
        list = list.map(item => {
          if (Array.isArray(item.children)) {
            return {...item, children: item.children.filter(filterer)};
          }

          if (item.children) {
            return {
              ...item,
              children: Object.fromEntries(
                Object.entries(item.children as Record<string, TableData<T>[]>).map(
                  ([key, rows]) => [key, rows.filter(filterer)],
                ),
              ),
            };
          }

          return item;
        });
      }

      return list.filter(filterer);
    },
    [filterChildren, filterValue],
  );

  const applySearch = React.useCallback(
    (records: TableData<T>[]) => {
      if (hideSearch || !searchText) {
        return records;
      }

      const term = searchText.toLowerCase();
      const searcher = (item: TableData<T>) =>
        item.searchableTerms?.some(value => value.toString().toLowerCase().includes(term));

      if (searchChildren) {
        return records
          .filter((item: TableData<T>) => {
            if (!item.children) {
              return searcher(item);
            }

            if (Array.isArray(item.children)) {
              return item.children?.find(searcher);
            }
            return Object.keys(item.children).find(key => item.children[key].find(searcher));
          })
          .map(item => {
            if (!item.children) {
              return item;
            }

            const {children, ...record} = item;

            if (Array.isArray(children)) {
              return {...record, children: children.filter(searcher)};
            }

            // filter out children tabs
            const keys = Object.keys(children).filter(key => children[key].find(searcher));
            const values = keys.map(key => ({
              [key]: children[key].filter(searcher),
            }));

            return {...record, children: assign({}, ...values)};
          }) as TableData<T>[];
      }

      return records.filter(searcher) as TableData<T>[];
    },
    [hideSearch, searchChildren, searchText],
  );

  const tableData = React.useMemo(() => {
    let records = [...data];

    records = applyFilter(records);
    records = applySearch(records);

    return records;
  }, [data, applyFilter, applySearch]);

  const checkedData = React.useMemo(
    () =>
      checkedRowKeys.length > 0
        ? tableData.filter(entry => checkedRowKeys.includes(entry[rowKey]))
        : tableData,
    [rowKey, tableData, checkedRowKeys],
  );

  return (
    <>
      <div>
        <Stack
          justifyContent="space-between"
          alignItems="baseline"
          spacing={8}
          className="d-print-none mt-2"
        >
          {!hideSearch && (
            <Stack.Item grow={2}>
              <SearchInput
                disabled={loading}
                value={searchText}
                placeholder={formatMessage(messages.searchPlaceholder, {
                  count: tableData.length,
                })}
                onChange={setSearchText}
              />
            </Stack.Item>
          )}

          {!hideFilter && (
            <Stack.Item>
              <FilterButton {...filterProps} />
            </Stack.Item>
          )}

          <Stack.Item grow={3} />

          {filterOptions?.length > 0 && (
            <Stack.Item>
              <SelectPicker
                disabled={loading}
                value={filterValue}
                onChange={setFilterValue}
                data={filterOptions}
                searchable={false}
                placeholder={filterPlaceholder ?? formatMessage(messages.filterPlaceholder)}
              />
            </Stack.Item>
          )}

          {actions?.map(action => (
            <Stack.Item key={action.id}>
              <ActionButton action={action} data={checkedData} disabled={loading} />
            </Stack.Item>
          ))}

          {!hideExport && (
            <Stack.Item>
              <ExportButton {...props} data={checkedData} disabled={loading} />
            </Stack.Item>
          )}
        </Stack>

        {checkedRowKeys.length > 0 && checkedActions.length > 0 && (
          <Stack
            justifyContent="flex-start"
            alignItems="baseline"
            spacing={8}
            className="d-print-none mt-3"
          >
            {checkedActions?.map(action => (
              <Stack.Item key={action.id}>
                <ActionButton action={action} data={checkedData} disabled={loading} />
              </Stack.Item>
            ))}

            <Button
              appearance="subtle"
              className="bg-neutral-70"
              startIcon={<Icon name={IconName.Clear} />}
              disabled={loading}
              onClick={() => setCheckedRowKeys([])}
            >
              {formatMessage(messages.clear, {count: checkedRowKeys.length})}
            </Button>
          </Stack>
        )}
        {checkedRowKeys.length > 0 && (
          <Stack className="d-print-none mt-3" spacing={8}>
            {props.checkedActionsChildren?.(checkedData)}
          </Stack>
        )}
      </div>
      {renderTable?.(tableData)}
    </>
  );
};
