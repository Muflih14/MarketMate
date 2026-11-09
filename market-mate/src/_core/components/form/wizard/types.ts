import type {FormBase, FormError, FormValue, GetErrorPropsFn, IdValue} from '@core/types';
import type React from 'react';
import type {IntlShape} from 'react-intl';
import type {StepItemProps} from 'rsuite';
import type {AnySchema} from 'yup';

export type OnChangeFn<T extends FormBase> = (key: keyof T, value: T[keyof T] | FormValue) => void;

export type WizardStepProps<T extends FormBase, S extends IdValue = IdValue> = {
  step: S;
  disabled?: boolean;
  initialData?: T;
  formData: T;
  onChange: OnChangeFn<T>;
  onStepChange?: (step: S) => void;
  onStepDirtyChange?: (isDirty: boolean) => void;
  getErrorProps: GetErrorPropsFn<T>;
};

export type StepConfig = {
  step?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: StepItemProps['icon'];
};

export type SetErrorsFn = (errors: FormError[]) => void;

export type WizardFormProps<T extends FormBase, S extends IdValue = IdValue> = {
  // Form processing
  initialData?: T;
  disabled?: boolean;
  isSaving?: boolean;
  savingLogs?: React.ReactNode[];
  onSave: (data: T, setErrors: SetErrorsFn) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  // Steps configuration
  steps: S[];
  config?: Partial<Record<S, StepConfig>>;
  getSchema: (step: S, intl: IntlShape) => AnySchema;
  getComponent: (step: S) => React.FC<WizardStepProps<T, S>>;
  // Navigation
  hideHeader?: boolean;
  hidePrev?: boolean;
  prevButton?: React.ReactNode;
  prevLabels?: Partial<Record<S, React.ReactNode>>;
  nextButton?: React.ReactNode;
  nextLabels?: Partial<Record<S, React.ReactNode>>;
  isNextDisabled?: (formData: T, step: S) => boolean;
  saveButton?: React.ReactNode;
  cancelButton?: React.ReactNode;
};
