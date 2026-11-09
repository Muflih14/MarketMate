import {DateInterval} from '@core/types/filters';
import {disableFuture, noFuture} from '@core/utils/dates';
import {endOfDay} from 'date-fns/endOfDay';
import {endOfMonth} from 'date-fns/endOfMonth';
import {startOfDay} from 'date-fns/startOfDay';
import {startOfMonth} from 'date-fns/startOfMonth';
import React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Divider from 'rsuite/Divider';
import Form from 'rsuite/Form';

import {RadioGroupField} from '../../form/field';
import type {FilterByProps} from '../types';
import {DayPicker} from './day-picker';
import {MonthPicker} from './month-picker';
import {RangePicker} from './range-picker';

const messages = defineMessages({
  [DateInterval.Day]: {
    id: 'app.common.day',
    defaultMessage: 'Day',
  },
  [DateInterval.Month]: {
    id: 'app.common.month',
    defaultMessage: 'Month',
  },
  [DateInterval.Range]: {
    id: 'app.common.period.range',
    defaultMessage: 'Range',
  },
});

export const FilterByDate = ({
  value,
  onChange,
  allowFuture = false,
  dayOnly = false,
}: FilterByProps) => {
  const {formatMessage} = useIntl();

  const commonProps = {
    className: 'filter-input',
  };
  const dateProps = {
    ...commonProps,
    allowFuture,
    value: value.dates,
    name: 'dates',
    editable: false,
    cleanable: false,
    shouldDisableDate: allowFuture ? undefined : disableFuture,
    placement: 'autoVerticalEnd',
    isoWeek: true,
  };

  const intervals = dayOnly ? [DateInterval.Day] : Object.values(DateInterval);
  const periodOptions = intervals
    .filter(
      period => !(dayOnly && (period === DateInterval.Month || period === DateInterval.Range)),
    )
    .map(period => ({
      value: period,
      label: formatMessage(messages[period]),
    }));

  const lastDay = React.useCallback(
    (day: Date) => (allowFuture ? day : noFuture(day)),
    [allowFuture],
  );

  const onChangeDay = React.useCallback(
    (day: Date) => {
      onChange('dates', [startOfDay(day), lastDay(endOfDay(day))]);
    },
    [onChange, lastDay],
  );

  const onChangeMonth = React.useCallback(
    (month: Date) => {
      onChange('dates', [startOfMonth(month), lastDay(endOfMonth(month))]);
    },
    [onChange, lastDay],
  );

  const onChangeRange = React.useCallback(
    ([day1, day2]: [Date, Date]) => {
      onChange('dates', [startOfDay(day1), lastDay(endOfDay(day2))]);
    },
    [onChange, lastDay],
  );

  const onChangePeriod = React.useCallback(
    (dateInterval: DateInterval) => {
      onChange('dateInterval', dateInterval);

      const defaultDate = value.dates?.[0] ?? new Date();

      switch (dateInterval) {
        case DateInterval.Day: {
          onChangeDay(defaultDate);
          break;
        }

        case DateInterval.Month: {
          onChangeMonth(defaultDate);
          break;
        }

        default:
          onChangeRange(value.dates ?? [defaultDate, defaultDate]);
      }
    },
    [value.dates, onChange, onChangeDay, onChangeMonth, onChangeRange],
  );

  return (
    <div data-testid="filter-by-date" className="w-100">
      <div className="filter-title">
        <FormattedMessage id="app.common.period.by" defaultMessage="By Period" />
      </div>

      <RadioGroupField
        {...commonProps}
        name="dateInterval"
        label=""
        value={value.dateInterval}
        data={periodOptions}
        inline
        onChange={val => onChangePeriod(val as DateInterval)}
      />

      {value.dateInterval && (
        <Form.Group controlId="dates">
          <Form.Label htmlFor="dates" className="filter-label">
            {formatMessage(messages[value.dateInterval])}
          </Form.Label>

          {value.dateInterval === DateInterval.Day && (
            <DayPicker {...dateProps} onChange={onChangeDay} />
          )}
          {!dayOnly && value.dateInterval === DateInterval.Month && (
            <MonthPicker {...dateProps} onChange={onChangeMonth} />
          )}
          {!dayOnly && value.dateInterval === DateInterval.Range && (
            <RangePicker {...dateProps} onChange={onChangeRange} />
          )}
        </Form.Group>
      )}

      <Divider spacing={20} />
    </div>
  );
};
