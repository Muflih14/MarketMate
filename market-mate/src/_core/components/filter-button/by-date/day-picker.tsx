import {disableFuture} from '@core/utils/dates';
import {addDays} from 'date-fns/addDays';
import {addMonths} from 'date-fns/addMonths';
import {addYears} from 'date-fns/addYears';
import React from 'react';
import {defineMessages, type MessageDescriptor, useIntl} from 'react-intl';
import DatePicker from 'rsuite/DatePicker';
import Form from 'rsuite/Form';

const messages = defineMessages({
  tomorrow: {
    id: 'app.common.tomorrow',
    defaultMessage: 'Tomorrow',
  },
  inOneWeek: {
    id: 'app.common.in-one-week',
    defaultMessage: 'In one week',
  },
  inOneMonth: {
    id: 'app.common.in-one-month',
    defaultMessage: 'In one month',
  },
  inOneYear: {
    id: 'app.common.in-one-year',
    defaultMessage: 'In one year',
  },
  today: {
    id: 'app.common.today',
    defaultMessage: 'Today',
  },
  oneWeekAgo: {
    id: 'app.common.one-week-ago',
    defaultMessage: 'One week ago',
  },
  oneMonthAgo: {
    id: 'app.common.one-month-ago',
    defaultMessage: 'One month ago',
  },
  oneYearAgo: {
    id: 'app.common.one-year-ago',
    defaultMessage: 'One year ago',
  },
});

type FM = (message: MessageDescriptor) => string;

export const getRanges = (allowFuture: boolean, formatMessage: FM) => {
  const now = new Date();

  return [
    {
      label: formatMessage(messages.tomorrow),
      value: addDays(now, 1),
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.inOneWeek),
      value: addDays(now, 7),
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.inOneMonth),
      value: addMonths(now, 1),
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.inOneYear),
      value: addYears(now, 1),
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.today),
      value: now,
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.oneWeekAgo),
      value: addDays(now, -7),
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.oneMonthAgo),
      value: addMonths(now, -1),
      closeOverlay: false,
      placement: 'left',
    },
    {
      label: formatMessage(messages.oneYearAgo),
      value: addYears(now, -1),
      closeOverlay: false,
      placement: 'left',
    },
  ].filter(entry => allowFuture || !disableFuture(entry.value));
};

export const DayPicker = ({value, allowFuture, ...props}: any) => {
  const {formatMessage} = useIntl();

  const ranges = React.useMemo(
    () => getRanges(allowFuture, formatMessage),
    [allowFuture, formatMessage],
  );

  return (
    <Form.Control
      {...props}
      data-testid="day-picker"
      accepter={DatePicker}
      format="dd MMM yyyy"
      ranges={ranges}
      showWeekNumbers
      value={value?.[0]}
    />
  );
};
