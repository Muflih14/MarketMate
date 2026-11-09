import {addDays} from 'date-fns/addDays';
import {differenceInSeconds} from 'date-fns/differenceInSeconds';
import {endOfDay} from 'date-fns/endOfDay';
import {formatISO} from 'date-fns/formatISO';
import {isAfter} from 'date-fns/isAfter';
import {min as minDate} from 'date-fns/min';
import {parseISO} from 'date-fns/parseISO';
import type {IntlShape} from 'react-intl';

import type {DateLikewise} from '../types';

export const weekEndOffsetDays = 6;
export const weekOptionsCount = 12;

export const now = () => formatISO(new Date());

const toFormatDate = (value: DateLikewise) => (typeof value === 'number' ? new Date(value) : value);

export const formatDay = (day?: DateLikewise) => {
  if (day == null || day === '') {
    return '';
  }
  if (typeof day === 'string') {
    return day;
  }
  return formatISO(toFormatDate(day), {representation: 'date'});
};

export const formatHour = (hour?: DateLikewise) => {
  if (hour == null || hour === '') {
    return '';
  }
  if (typeof hour === 'string') {
    return hour;
  }
  return formatISO(toFormatDate(hour), {representation: 'time'});
};

export const formatDayHour = (dayHour?: DateLikewise) => {
  if (dayHour == null || dayHour === '') {
    return '';
  }
  if (typeof dayHour === 'string') {
    return dayHour;
  }
  return formatISO(toFormatDate(dayHour), {representation: 'complete'});
};

export const getWeekEnd = (weekStart: Date) => addDays(weekStart, weekEndOffsetDays);

export const formatWeekRange = (start: Date, end: Date, intl: IntlShape) =>
  intl.formatDateTimeRange(start, end, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const toDay = (day?: DateLikewise) => {
  if (!day) {
    return new Date();
  }
  if (typeof day === 'string') {
    return parseISO(day);
  }
  if (typeof day === 'number') {
    return new Date(day);
  }
  return day;
};

export const disableFuture = (dt: Date) => isAfter(endOfDay(dt), endOfDay(new Date()));

export const noFuture = (dt: Date) => minDate([endOfDay(dt), endOfDay(new Date())]);

export const distanceInSecs = (dt?: DateLikewise) => differenceInSeconds(toDay(dt), toDay());
