import type React from 'react';
import type {FormControlProps, FormErrorMessageProps, FormHelpTextProps} from 'rsuite';
import Form from 'rsuite/Form';

type HelpType = 'warning' | 'info';

type HelpTextProps = FormHelpTextProps & {
  text: string;
  helpType?: HelpType;
};

const HelpText = ({text, helpType, tooltip = false}: HelpTextProps) => (
  <Form.Text tooltip={tooltip} style={{color: helpType === 'warning' ? 'orange' : ''}}>
    {text}
  </Form.Text>
);

export type FormGroupProps<T = any> = Omit<
  FormControlProps<T>,
  'defaultValue' | 'value' | 'onSelect'
> & {
  defaultValue?: T | null;
  value?: T | null;
  label?: string;
  placeholder?: string;
  helpType?: HelpType;
  helpText?: string;
  helpTooltip?: boolean;
  className?: string;
  classNameLabel?: string;
  block?: boolean;
  errorMessage?: string;
  errorPlacement?: FormErrorMessageProps['placement'];
};

export const FormGroup = (props: React.PropsWithChildren<FormGroupProps>) => {
  const {
    name,
    label,
    classNameLabel,
    helpText,
    helpType,
    helpTooltip,
    errorMessage,
    errorPlacement = 'static',
    children,
  } = props;

  return (
    <Form.Group data-testid={`form-group-${name}`} controlId={name}>
      <Form.Label
        data-testid={`form-group-label-${name}`}
        htmlFor={name}
        className={classNameLabel}
      >
        {label}
        {helpText && (helpTooltip || !!errorMessage) && (
          <HelpText text={helpText} helpType={helpType} tooltip />
        )}
      </Form.Label>

      {children}

      <Form.ErrorMessage placement={errorPlacement} show={!!errorMessage}>
        {errorMessage}
      </Form.ErrorMessage>

      {helpText && !helpTooltip && !errorMessage && (
        <HelpText text={helpText} helpType={helpType} />
      )}
    </Form.Group>
  );
};
