import {Row} from 'rsuite';
import Form from 'rsuite/Form';
import Toggle, {type ToggleProps} from 'rsuite/Toggle';

import {Icon, IconName} from '../../icon';
import {FormGroup, type FormGroupProps} from './group';
import {getInputControlProps} from './utils';

type ToggleFieldProps = Omit<ToggleProps, 'defaultValue' | 'value'> &
  FormGroupProps<boolean> & {
    description?: React.ReactNode;
    labelPlacement?: 'start' | 'end';
  };

export const ToggleField: React.FC<ToggleFieldProps> = ({
  description,
  label,
  labelPlacement = 'start',
  ...props
}) => {
  const control = (
    <Form.Control
      accepter={Toggle}
      checkedChildren={<Icon name={IconName.Success} />}
      unCheckedChildren={<Icon name={IconName.Error} />}
      {...getInputControlProps(props)}
    />
  );

  const labelBlock = (
    <div>
      {label && <div className="label">{label}</div>}
      {description && <div className="label-medium text-muted">{description}</div>}
    </div>
  );

  return (
    <FormGroup {...props} label={undefined}>
      <Row className="gap-2">
        {labelPlacement === 'start' && labelBlock}

        {control}

        {labelPlacement === 'end' && labelBlock}
      </Row>
    </FormGroup>
  );
};
