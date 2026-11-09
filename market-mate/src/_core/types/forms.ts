import type React from 'react';

import type {IdValue, Json} from './generic';

export type FormBase = Json;

export type FormOption = {value: IdValue; label: React.ReactNode; item: Json};

export type FormValue = string | number | boolean | Date | null | File | FormOption | FormValue[];

// Validation types

export type FormError = {path?: string; error: string};

export type ClearErrorsFn = () => void;

export type ValidateFn<T> = (values: Partial<T>) => Promise<boolean>;

export type GetErrorPropsFn<T> = (key: keyof T) => {errorMessage?: string};

export type PartialFormProps<T extends FormBase> = {
  data: T;
  onChange: (key: keyof T, value?: FormValue) => void;
  getErrorProps: GetErrorPropsFn<T>;
};
