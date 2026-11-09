import type {IdValue} from '@core/types';
import {formatDay, formatWeekRange, getWeekEnd, weekOptionsCount} from '@core/utils/dates';
import {booleanMessages} from '@core/utils/generic';
import {addWeeks} from 'date-fns/addWeeks';
import {parseISO} from 'date-fns/parseISO';
import {startOfISOWeek} from 'date-fns/startOfISOWeek';
import React from 'react';
import {useIntl} from 'react-intl';
import Form from 'rsuite/Form';
import InputPicker from 'rsuite/InputPicker';
import SelectPicker, {type SelectPickerProps} from 'rsuite/SelectPicker';

import {FormGroup, type FormGroupProps} from './group';
import {getControlProps} from './utils';

const currentIsoMonday = () => startOfISOWeek(new Date());

export type SelectFieldProps<T = IdValue> = SelectPickerProps<T> & FormGroupProps<T>;

export const SelectField = <T = IdValue,>({searchable, ...props}: SelectFieldProps<T>) => {
  const accepter = searchable ? SelectPicker : InputPicker;

  return (
    <FormGroup {...props}>
      <Form.Control {...getControlProps(props)} accepter={accepter} />
    </FormGroup>
  );
};

type BooleanSelectFieldProps = Omit<SelectFieldProps<boolean>, 'data'>;

export const BooleanSelectField = (props: BooleanSelectFieldProps) => {
  const {formatMessage} = useIntl();

  const options = React.useMemo(
    () => [
      {value: true, label: formatMessage(booleanMessages.true)},
      {value: false, label: formatMessage(booleanMessages.false)},
    ],
    [formatMessage],
  );

  return <SelectField data={options} {...props} />;
};

type WeekSelectFieldProps = Omit<SelectFieldProps<Date>, 'data' | 'value' | 'onSelect'> & {
  value?: Date | null;
  onSelect?: (value: Date) => void;
};

export const WeekSelectField = ({value, onSelect, ...props}: WeekSelectFieldProps) => {
  const intl = useIntl();

  const options = React.useMemo(() => {
    const thisMonday = currentIsoMonday();

    return Array.from({length: weekOptionsCount}, (_, i) => {
      const monday = addWeeks(thisMonday, i);
      const sunday = getWeekEnd(monday);
      const label = formatWeekRange(monday, sunday, intl);

      return {value: formatDay(monday), label};
    });
  }, [intl]);

  const isoValue = value ? formatDay(value) : null;

  const handleSelect = React.useCallback(
    (isoDate: string, _item: unknown, _event: React.SyntheticEvent) => {
      onSelect?.(parseISO(isoDate));
    },
    [onSelect],
  );

  return (
    <SelectField<string>
      {...(props as SelectFieldProps<string>)}
      data={options}
      value={isoValue}
      onSelect={handleSelect}
    />
  );
};
