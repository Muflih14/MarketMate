import type {FormBase, IdValue} from '@core/types';
import isEqual from 'lodash-es/isEqual';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import Button from 'rsuite/Button';
import List from 'rsuite/List';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import Stack from 'rsuite/Stack';
import Steps from 'rsuite/Steps';

import {Icon, IconName} from '../../icon';
import type {OnChangeFn, WizardFormProps} from './types';
import {useFormValidator} from './use-form-validator';

const messages = {
  errorsFound: {
    id: 'app.common.errors.found',
    defaultMessage:
      '{val, plural, =0 {No errors found} one {One error found} other {# errors found}}',
  },
};

/**
 * Wizard Form
 *
 * @returns ReactNode
 */
export const WizardForm = <T extends FormBase, S extends IdValue = IdValue>({
  // Form processing
  initialData,
  disabled = false,
  isSaving = false,
  savingLogs = [],
  onSave,
  onCancel,
  onDirtyChange,
  // Steps configuration
  steps,
  config = {},
  getSchema,
  getComponent,
  // navigation
  hideHeader = false,
  hidePrev = false,
  prevButton,
  prevLabels,
  nextButton,
  nextLabels,
  isNextDisabled,
  saveButton,
  cancelButton,
}: WizardFormProps<T, S>) => {
  const intl = useIntl();

  const [step, setStep] = React.useState(0);
  const [formData, setFormData] = React.useState<T>(() => (initialData ?? {}) as T);
  const [appliedInitial, setAppliedInitial] = React.useState(initialData);
  const [stepDirty, setStepDirty] = React.useState(false);

  if (initialData && initialData !== appliedInitial) {
    setAppliedInitial(initialData);
    setFormData(initialData);
  }

  // Number of steps
  const stepsCount = React.useMemo(() => steps.length, [steps]);
  const currentStep = React.useMemo(() => steps[step], [steps, step]);

  // Get schema validation in current step
  const formSchema = React.useMemo(
    () => getSchema(currentStep, intl),
    [getSchema, intl, currentStep],
  );
  const {errors, hasError, clearErrors, setErrors, getErrorProps, validate} =
    useFormValidator<T>(formSchema);

  const StepComponent = getComponent(currentStep);

  const onChangeStep = React.useCallback(
    (newStep: number) => {
      setStepDirty(false);
      setStep(Math.min(Math.max(newStep, 0), stepsCount - 1));
    },
    [stepsCount],
  );

  const onStepChange = React.useCallback(
    (newStep: S) => {
      const newStepIndex = steps.indexOf(newStep);
      if (newStepIndex >= 0) {
        onChangeStep(newStepIndex);
      }
    },
    [onChangeStep, steps],
  );

  const onPreviousStep = () => onChangeStep(step - 1);
  const onNextStep = async () => {
    clearErrors();

    const isValid = await validate(formData);
    if (!isValid) {
      return;
    }

    onChangeStep(step + 1);
  };

  const onChange: OnChangeFn<T> = React.useCallback(
    (key, value) => {
      clearErrors();
      setFormData(state => ({...state, [key]: value}));
    },
    [clearErrors],
  );

  const onComplete = async () => {
    clearErrors();

    const isValid = await validate(formData);
    if (!isValid) {
      return;
    }

    await onSave(formData, setErrors);
  };

  const isDirty = React.useMemo(
    () => stepDirty || !isEqual(formData, (initialData ?? {}) as T),
    [formData, initialData, stepDirty],
  );

  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <div className="wizard-form">
      <div className="wizard-form-body">
        <div className="mt-4">
          <Steps data-testid="steps" current={step} currentStatus={hasError ? 'error' : undefined}>
            {steps.map(s => (
              <Steps.Item
                key={s}
                data-testid={`wizard-step-${s}`}
                title={config[s]?.step ?? s}
                description={<small>{config[s]?.description}</small>}
                icon={config[s]?.icon}
                className="pb-2"
              />
            ))}
          </Steps>

          {!hideHeader && (
            <div className="header my-4">
              <div className="title" data-testid="wizard-step-title">
                {config[currentStep]?.title ?? config[currentStep]?.step ?? currentStep}
              </div>
              <div className="subtitle">{config[currentStep]?.subtitle ?? ''}</div>
            </div>
          )}
        </div>

        {/*
        The Loader with backdrop is not disabling the whole page.
        As a workaround we use the Modal to indicate that the form is being processed
        and disable the rest of components till it concludes.
      */}
        {isSaving && (
          <Modal data-testid="modal" open={isSaving} backdrop overflow keyboard={false}>
            <Modal.Header data-testid="modal-header">
              <Modal.Title data-testid="modal-title">
                <Loader
                  size="sm"
                  content={
                    <FormattedMessage
                      id="app.common.saving"
                      defaultMessage="Saving data in progress…"
                    />
                  }
                />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="modal-body">
              <List data-testid="list">
                {savingLogs.map((msg, index) => (
                  <List.Item data-testid="list-item" key={index} index={index} className="px-3">
                    {msg}
                  </List.Item>
                ))}
              </List>
            </Modal.Body>
          </Modal>
        )}

        {React.createElement(StepComponent, {
          step: currentStep,
          disabled: disabled || isSaving,
          initialData,
          formData,
          onChange,
          onStepChange,
          onStepDirtyChange: setStepDirty,
          getErrorProps,
        })}
      </div>

      <div className="wizard-deck">
        {hasError && (
          <p data-testid="wizard-error-message" className="body-small text-error-70 mb-2">
            <FormattedMessage {...messages.errorsFound} values={{val: errors?.length ?? 0}} />
          </p>
        )}
        <Stack data-testid="stack" spacing={20} alignItems="flex-start">
          {step !== stepsCount - 1 && (
            <Stack.Item data-testid="stack-item">
              <Button
                data-testid="button-next"
                type="button"
                appearance="primary"
                onClick={onNextStep}
                disabled={disabled || isSaving || isNextDisabled?.(formData, currentStep) === true}
              >
                {nextLabels?.[currentStep] ?? nextButton ?? (
                  <FormattedMessage id="app.common.next" defaultMessage="Next" />
                )}
              </Button>
            </Stack.Item>
          )}

          {step === stepsCount - 1 && (
            <Stack.Item data-testid="stack-item">
              <Button
                data-testid="button-save"
                type="button"
                appearance="primary"
                onClick={onComplete}
                disabled={disabled || isSaving}
              >
                {saveButton ?? <FormattedMessage id="app.common.save" defaultMessage="Save" />}
              </Button>
            </Stack.Item>
          )}

          <Stack.Item data-testid="stack-item">
            <Button
              data-testid="button-cancel"
              type="button"
              appearance="ghost"
              onClick={onCancel}
              disabled={disabled || isSaving}
            >
              {cancelButton ?? <FormattedMessage id="app.common.cancel" defaultMessage="Cancel" />}
            </Button>
          </Stack.Item>

          {!hidePrev && step > 0 && (
            <>
              <Stack.Item data-testid="stack-item-spacer" grow={1} />
              <Stack.Item data-testid="stack-item">
                <Button
                  data-testid="button-prev"
                  startIcon={<Icon name={IconName.ArrowBack} />}
                  type="button"
                  appearance="default"
                  onClick={onPreviousStep}
                  disabled={disabled || isSaving}
                >
                  {prevLabels?.[currentStep] ?? prevButton ?? (
                    <FormattedMessage id="app.common.previous" defaultMessage="Previous" />
                  )}
                </Button>
              </Stack.Item>
            </>
          )}
        </Stack>
      </div>
    </div>
  );
};
