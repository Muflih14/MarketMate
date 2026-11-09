import type {IdValue, Json} from '@core/types';
import Form from 'rsuite/Form';
import Radio, {type RadioProps} from 'rsuite/Radio';
import RadioGroup from 'rsuite/RadioGroup';

import {FormGroup, type FormGroupProps} from './group';
import {getControlProps} from './utils';

type RadioOption<T extends IdValue = IdValue> = {
  value: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  item?: Json;
  checked?: boolean;
  disabled?: boolean;
  testId?: string;
};

type RadioGroupFieldProps<T extends IdValue = IdValue> = FormGroupProps<T> &
  Omit<RadioProps<T>, 'value' | 'defaultValue'> & {
    data: RadioOption<T>[];
    inline?: boolean;
  };

export const RadioGroupField = <T extends IdValue = IdValue>(props: RadioGroupFieldProps<T>) => {
  const {inline} = props;

  return (
    <FormGroup {...props}>
      <Form.Control {...getControlProps(props)} accepter={RadioGroup} inline={inline}>
        {props.data?.map((item, index) => (
          <div key={item.value} className={inline ? 'd-inline-block' : undefined}>
            <Radio
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              data-testid={item.testId}
              className={index > 0 ? (inline ? 'ms-1' : 'mt-2') : ''}
            >
              {item.label}
            </Radio>
            {item.description && (
              <div className="input-small text-muted ms-4">{item.description}</div>
            )}
          </div>
        ))}
      </Form.Control>
    </FormGroup>
  );
};
