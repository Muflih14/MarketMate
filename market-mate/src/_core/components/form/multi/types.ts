import type {DictOf, FormBase, Json} from '@core/types';
import type React from 'react';
import type {MessageDescriptor} from 'react-intl';

export type SingleFormProps<T extends FormBase> = {
  record?: T;
  otherRecords?: T[];
  onSave: (item: T) => void;
  onCancel: () => void;
};

export type MultiFormProps<T extends FormBase> = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  addLabel?: React.ReactNode;
  successMessage?: React.ReactNode;
  repeatLabel?: React.ReactNode;
  renderItem: (item: T) => React.ReactNode;
  Form: React.FC<SingleFormProps<T>>;
  submit: (item: T) => Promise<Json>;
  onSuccess?: () => void;
  submitLabel?: React.ReactNode;
  filename: string;
  headers: (keyof T)[];
  fieldNames?: DictOf<MessageDescriptor>;
};

export type CompleteProps<T extends FormBase> = {
  message?: React.ReactNode;
  resetLabel?: React.ReactNode;
  reset: () => void;
  headers: (keyof T)[];
  records: T[];
  filename: string;
};

export type ResponseError = DictOf<string[]>;

export type ErrorProps = {
  data: ResponseError;
  fieldNames?: DictOf<MessageDescriptor>;
};
