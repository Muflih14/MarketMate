import {omitProps} from '@core/utils';

import type {FormGroupProps} from './group';

const groupProps = [
  'helpText',
  'helpType',
  'helpTooltip',
  'errorMessage',
  'label',
  'classNameLabel',
];

const getPlaceholder = ({label, placeholder}: FormGroupProps) => placeholder ?? label;

export const getControlProps = (props: any) => ({
  ...omitProps(props, groupProps),
  placeholder: getPlaceholder(props),
});

export const getInputControlProps = (props: any) => {
  const controlProps = getControlProps(props);

  if (props.block) {
    controlProps.block = true;
  } else {
    delete controlProps.block;
  }

  return controlProps;
};
