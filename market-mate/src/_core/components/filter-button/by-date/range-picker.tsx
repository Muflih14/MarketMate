import {disableFuture, noFuture} from '@core/utils/dates';
import {addDays} from 'date-fns/addDays';
import {addMonths} from 'date-fns/addMonths';
import {addYears} from 'date-fns/addYears';
import {endOfMonth} from 'date-fns/endOfMonth';
import {endOfWeek} from 'date-fns/endOfWeek';
import {endOfYear} from 'date-fns/endOfYear';
import {startOfMonth} from 'date-fns/startOfMonth';
import {startOfWeek} from 'date-fns/startOfWeek';
import {startOfYear} from 'date-fns/startOfYear';
import React from 'react';
import {defineMessages, type MessageDescriptor, useIntl} from 'react-intl';
import DateRangePicker from 'rsuite/DateRangePicker';
import Form from 'rsuite/Form';

const messages = defineMessages({
  nextWeek: {
    id: 'app.common.next-week',
    defaultMessage: 'Next week',
  },
  nextMonth: {
    id: 'app.common.next-month',
    defaultMessage: 'Next month',
  },
  nextYear: {
    id: 'app.common.next-year',
    defaultMessage: 'Next year',
  },
  thisWeek: {
    id: 'app.common.this-week',
    defaultMessage: 'This week',
  },
  thisMonth: {
    id: 'app.common.this-month',
    defaultMessage: 'This month',
  },
  thisYear: {
    id: 'app.common.this.year',
    defaultMessage: 'This year',
  },
  lastWeek: {
    id: 'app.common.last-week',
    defaultMessage: 'Last week',
  },
  lastMonth: {
    id: 'app.common.last-month',
    defaultMessage: 'Last month',
  },
  lastYear: {
    id: 'app.common.last-year',
    defaultMessage: 'Last year',
  },
});

type FM = (message: MessageDescriptor) => string;

export const getRanges = (allowFuture: boolean, formatMessage: FM) => {
  const now = new Date();

  const lastDay = (day: Date) => (allowFuture ? day : noFuture(day));

  return [
    {
      label: formatMessage(messages.nextWeek),
      value: [
        addDays(startOfWeek(now, {weekStartsOn: 1}), 7),
        addDays(endOfWeek(now, {weekStartsOn: 1}), 7),
      ],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.nextMonth),
      value: [startOfMonth(addMonths(now, 1)), endOfMonth(addMonths(now, 1))],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.nextYear),
      value: [startOfYear(addYears(now, 1)), endOfYear(addYears(now, 1))],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.thisWeek),
      value: [startOfWeek(now, {weekStartsOn: 1}), endOfWeek(now, {weekStartsOn: 1})],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.thisMonth),
      value: [startOfMonth(now), endOfMonth(now)],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.thisYear),
      value: [startOfYear(now), endOfYear(now)],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.lastWeek),
      value: [
        addDays(startOfWeek(now, {weekStartsOn: 1}), -7),
        addDays(endOfWeek(now, {weekStartsOn: 1}), -7),
      ],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.lastMonth),
      value: [startOfMonth(addMonths(now, -1)), endOfMonth(addMonths(now, -1))],
      closeOverlay: false,
    },
    {
      label: formatMessage(messages.lastYear),
      value: [startOfYear(addYears(now, -1)), endOfYear(addYears(now, -1))],
      closeOverlay: false,
    },
  ]
    .filter(entry => allowFuture || !disableFuture(entry.value[0]))
    .map(entry => ({...entry, value: entry.value.map(lastDay)}));
};

export const RangePicker = ({allowFuture, ...props}: any) => {
  const {formatMessage} = useIntl();

  const ranges = React.useMemo(
    () => getRanges(allowFuture, formatMessage),
    [allowFuture, formatMessage],
  );

  return (
    <Form.Control
      {...props}
      data-testid="range-picker"
      accepter={DateRangePicker}
      format="dd MMM yyyy"
      ranges={ranges}
      showWeekNumbers
    />
  );
};
