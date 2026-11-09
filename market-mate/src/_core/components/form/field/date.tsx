import {endOfDay} from 'date-fns/endOfDay';
import {getISODay} from 'date-fns/getISODay';
import {isAfter} from 'date-fns/isAfter';
import {isBefore} from 'date-fns/isBefore';
import {startOfDay} from 'date-fns/startOfDay';
import DatePicker, {type DatePickerProps} from 'rsuite/DatePicker';
import Form from 'rsuite/Form';

import {FormGroup, type FormGroupProps} from './group';
import {getControlProps} from './utils';

export type DatePickerFieldProps = DatePickerProps &
  FormGroupProps<Date> & {
    max?: Date;
    min?: Date;
    disableWeekdays?: number[];
  };

export const DatePickerField = ({
  min,
  max,
  disableWeekdays,
  shouldDisableDate,
  shouldDisableHour,
  shouldDisableMinute,
  ...props
}: DatePickerFieldProps) => {
  const isDisabledDate = (date: Date): boolean => {
    return (
      (!!shouldDisableDate && shouldDisableDate(date)) ||
      (!!min && isBefore(date, startOfDay(min))) ||
      (!!max && isAfter(date, endOfDay(max))) ||
      (!!disableWeekdays?.length && disableWeekdays.includes(getISODay(date)))
    );
  };

  const isDisabledHour = (hour: number, date: Date): boolean => {
    return isDisabledDate(date) || (!!shouldDisableHour && shouldDisableHour(hour, date));
  };

  const isDisabledMinute = (minute: number, date: Date): boolean => {
    return (
      isDisabledHour(date.getHours(), date) ||
      (!!shouldDisableMinute && shouldDisableMinute(minute, date))
    );
  };

  return (
    <FormGroup {...props}>
      <Form.Control
        accepter={DatePicker}
        isoWeek
        {...getControlProps(props)}
        shouldDisableDate={isDisabledDate}
        shouldDisableHour={isDisabledHour}
        shouldDisableMinute={isDisabledMinute}
      />
    </FormGroup>
  );
};
