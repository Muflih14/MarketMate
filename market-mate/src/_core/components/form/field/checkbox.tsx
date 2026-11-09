import type {IdValue} from '@core/types';
import Checkbox from 'rsuite/Checkbox';
import CheckboxGroup from 'rsuite/CheckboxGroup';
import Form from 'rsuite/Form';

import {FormGroup, type FormGroupProps} from './group';
import {getControlProps} from './utils';

type CheckboxOption<T extends IdValue = IdValue> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
  testId?: string;
};

type CheckboxGroupFieldProps<T extends IdValue = IdValue> = Omit<
  FormGroupProps<T[]>,
  'onChange'
> & {
  data: CheckboxOption<T>[];
  inline?: boolean;
  onChange?: (value: T[]) => void;
};

export const CheckboxGroupField = <T extends IdValue = IdValue>(
  props: CheckboxGroupFieldProps<T>,
) => {
  const {inline, data, onChange} = props;

  return (
    <FormGroup {...props}>
      <Form.Control
        {...getControlProps({...props, data: undefined})}
        accepter={CheckboxGroup}
        inline={inline}
        onChange={(value: (string | number)[]) => onChange?.(value as T[])}
      >
        {data?.map(item => (
          <Checkbox
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            data-testid={item.testId}
          >
            {item.label}
          </Checkbox>
        ))}
      </Form.Control>
    </FormGroup>
  );
};
