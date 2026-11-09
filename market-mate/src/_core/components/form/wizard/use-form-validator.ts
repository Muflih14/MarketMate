import type {ClearErrorsFn, FormBase, FormError, GetErrorPropsFn, ValidateFn} from '@core/types';
import React from 'react';
import {defineMessage, type MessageDescriptor, useIntl} from 'react-intl';
import type {ISchema, ValidationError} from 'yup';

type Result = {
  isValid: boolean;
  errors?: FormError[];
};

const message: MessageDescriptor = defineMessage({
  id: 'app.common.errors.found',
  defaultMessage: '{val, plural, =0 {No errors} one {One error} other {# errors}} found',
});

export const validateForm = async <T>(
  schema: ISchema<any>,
  values: Partial<T>,
): Promise<Result> => {
  try {
    await schema.validate(values, {abortEarly: false, strict: true});
    return {isValid: true};
  } catch (err) {
    return {
      isValid: false,
      errors: (err as ValidationError).inner.map(e => ({
        path: e.path,
        error: e.errors[0],
      })),
    };
  }
};

export const useFormValidator = <T extends FormBase>(schema: ISchema<any>) => {
  const {formatMessage} = useIntl();
  const [errors, setErrorState] = React.useState<FormError[]>();

  const clearErrors: ClearErrorsFn = React.useCallback(() => {
    setErrorState(undefined);
  }, []);

  const setErrors = React.useCallback((newErrors: FormError[]) => {
    setErrorState(newErrors);
  }, []);

  const getErrorProps: GetErrorPropsFn<T> = React.useCallback(
    (path: keyof T) => {
      if (errors) {
        const error = errors.find(err => err.path === path);
        if (error) {
          return {errorMessage: error.error};
        }

        // Sometimes the path belongs to an array property
        const nestedErrors = errors.filter(err => err.path?.startsWith(`${path as string}[`));
        if (nestedErrors.length > 0) {
          return {
            errorMessage: formatMessage(message, {val: nestedErrors.length}),
          };
        }
      }

      return {};
    },
    [errors, formatMessage],
  );

  const validate: ValidateFn<T> = React.useCallback(
    async (values: Partial<T>) => {
      const result = await validateForm(schema, values);
      if (!result.isValid && result.errors !== undefined) {
        setErrorState(result.errors);
        return false;
      }

      setErrorState(undefined);
      return true;
    },
    [schema],
  );

  return {
    errors,
    clearErrors,
    setErrors,
    getErrorProps,
    validate,
    hasError: !!errors?.length,
  };
};
