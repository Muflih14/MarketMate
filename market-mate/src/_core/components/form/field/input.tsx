import Form from 'rsuite/Form';
import type {InputProps as RSInputProps} from 'rsuite/Input';
import NumberInput, {type NumberInputProps} from 'rsuite/NumberInput';
import Textarea, {type TextareaProps} from 'rsuite/Textarea';

import {FormGroup, type FormGroupProps} from './group';
import {getInputControlProps} from './utils';

type InputFieldProps<T = string> = FormGroupProps<T> & RSInputProps;

export const InputField = (props: InputFieldProps) => {
  return (
    <FormGroup {...props}>
      <Form.Control {...getInputControlProps(props)} />
    </FormGroup>
  );
};

type InputNumberFieldProps = NumberInputProps<number> & InputFieldProps<number>;

export const InputNumberField = (props: InputNumberFieldProps) => {
  return (
    <FormGroup {...props}>
      <Form.Control {...getInputControlProps(props)} accepter={NumberInput} />
    </FormGroup>
  );
};

type TextAreaFieldProps = FormGroupProps<string> & TextareaProps;

export const TextAreaField = (props: TextAreaFieldProps) => {
  return (
    <FormGroup {...props}>
      <Form.Control {...getInputControlProps(props)} accepter={Textarea} />
    </FormGroup>
  );
};
