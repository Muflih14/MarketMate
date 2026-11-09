import React from 'react';
import {useIntl} from 'react-intl';
import RSPagination from 'rsuite/Pagination';

import {defaultLocale} from './locale';
import type {PaginationProps} from './types';

export const Pagination = ({
  total = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onLimitChange,
  locale = {},
}: PaginationProps) => {
  const {formatMessage} = useIntl();

  const handleChangeLimit = React.useCallback(
    (value: number) => {
      onLimitChange(value);
      onPageChange(1);
    },
    [onLimitChange, onPageChange],
  );

  return (
    <div className="m-3">
      <RSPagination
        first={<i className="fa-solid fa-angles-left" />}
        prev={<i className="fa-solid fa-angle-left" />}
        next={<i className="fa-solid fa-angle-right" />}
        last={<i className="fa-solid fa-angles-right" />}
        ellipsis={<i className="fa-solid fa-ellipsis" />}
        boundaryLinks
        maxButtons={5}
        size="xs"
        className="d-print-none"
        layout={['total', '-', 'limit', '|', 'pager', 'skip']}
        total={total}
        activePage={currentPage}
        limit={pageSize}
        limitOptions={[5, 10, 20, 50]}
        onChangePage={onPageChange}
        onChangeLimit={handleChangeLimit}
        locale={{
          more: formatMessage(locale.more ?? defaultLocale.more),
          prev: formatMessage(locale.prev ?? defaultLocale.prev),
          next: formatMessage(locale.next ?? defaultLocale.next),
          first: formatMessage(locale.first ?? defaultLocale.first),
          last: formatMessage(locale.last ?? defaultLocale.last),
          limit: `{0} ${formatMessage(locale.limit ?? defaultLocale.limit)}`,
          total: `${formatMessage(locale.total ?? defaultLocale.total)} {0}`,
          skip: `${formatMessage(locale.skip ?? defaultLocale.skip)} {0}`,
        }}
      />
    </div>
  );
};
