import React from 'react';
import Avatar from 'rsuite/Avatar';
import Badge from 'rsuite/Badge';

import {Icon, IconName} from '../../icon';
import {FormGroup, type FormGroupProps} from './group';

type PictureFieldProps = FormGroupProps<File> & {
  cleanable?: boolean;
  onSelect: (value?: File) => void;
  accept?: string;
};

type PictureProps = PictureFieldProps & {
  value: File;
};

const DeleteIcon = ({onClick}: {onClick: () => void}) => (
  <Icon
    data-testid="icon-delete"
    name={IconName.Delete}
    circle
    size="sm"
    onClick={onClick}
    className="pointer"
  />
);

const Picture = ({value, cleanable, onSelect}: PictureProps) => {
  const url = React.useMemo(() => URL.createObjectURL(value), [value]);

  return (
    <Badge
      data-testid="badge"
      className="photo"
      content={cleanable ? <DeleteIcon onClick={() => onSelect()} /> : undefined}
    >
      <Avatar
        data-testid="avatar"
        size="xxl"
        className="picture xxxxl"
        src={url}
        alt={value.name}
        title={value.name}
      />
    </Badge>
  );
};

const Input = ({accept, name, label, placeholder, onSelect}: PictureFieldProps) => {
  const onFileChange = (files: FileList | null) => {
    if (!files?.[0]) {
      return;
    }

    onSelect(files[0]);

    // clean input value
    const input = document?.getElementById(name) as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="upload-button">
      <label htmlFor={name}>
        <div>
          <Icon data-testid="icon-camera" name={IconName.Camera} size="sm" />
        </div>

        <div>{placeholder ?? label}</div>
      </label>

      <input
        name={name}
        id={name}
        type="file"
        accept={accept ?? 'image/*'}
        className="hidden-file"
        onChange={event => onFileChange(event.target.files)}
      />
    </div>
  );
};

export const PictureField = (props: PictureFieldProps) => {
  return (
    <FormGroup {...props}>
      {props.value ? <Picture {...props} value={props.value} /> : <Input {...props} />}
    </FormGroup>
  );
};
