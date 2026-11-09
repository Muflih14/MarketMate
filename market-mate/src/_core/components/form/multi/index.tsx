import type {DictOf, FormBase} from '@core/types';
import omit from 'lodash-es/omit';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Col from 'rsuite/Col';
import Grid from 'rsuite/Grid';
import IconButton from 'rsuite/IconButton';
import Row from 'rsuite/Row';
import Stack from 'rsuite/Stack';
import {v4 as uuidv4} from 'uuid';

import {Icon, IconName} from '../../icon';
import {Complete} from './complete';
import {RowError} from './error';
import type {MultiFormProps, ResponseError} from './types';

export const MultiForm = <T extends FormBase>({
  title,
  subtitle,
  addLabel,
  submit,
  submitLabel,
  onSuccess,
  renderItem,
  Form,
  successMessage,
  repeatLabel,
  filename,
  headers,
  fieldNames,
}: MultiFormProps<T>) => {
  const [record, setRecord] = React.useState<DictOf<T>>({});
  const [recordError, setRecordError] = React.useState<DictOf<ResponseError>>({});
  const [showForm, setShowForm] = React.useState(true);
  const [currentKey, setCurrentKey] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isErred, setIsErred] = React.useState(false);

  const currentRecord = React.useMemo(
    () => (currentKey ? record[currentKey] : undefined),
    [record, currentKey],
  );
  const otherRecords = React.useMemo(
    () =>
      Object.keys(record)
        .filter(key => key !== currentKey)
        .map(key => record[key]),
    [record, currentKey],
  );

  const handleCancel = React.useCallback(() => {
    setCurrentKey(undefined);
    setShowForm(false);
  }, []);

  const saveRecord = React.useCallback(
    (item: T) => {
      setRecord(state => ({...state, [currentKey ?? uuidv4()]: item}));
      setCurrentKey(undefined);
      setShowForm(false);
    },
    [currentKey],
  );

  const editRecord = React.useCallback((key: string) => {
    setCurrentKey(key);
    setShowForm(true);
    setIsErred(false);
  }, []);

  const deleteRecord = React.useCallback((key: string) => {
    setRecord(state => omit(state, key));
    setRecordError(state => omit(state, key));
  }, []);

  const handleSubmit = React.useCallback(
    async (doc: DictOf<T>) => {
      setIsSubmitting(true);
      setRecordError({});
      setIsErred(false);

      try {
        const errors: DictOf<ResponseError> = {};
        const remaining = {...doc};

        for (const key of Object.keys(doc)) {
          try {
            await submit(doc[key]);
            delete remaining[key];
          } catch (err) {
            const data = ((err as {data?: ResponseError})?.data ?? {}) as ResponseError;
            errors[key] = data;
          }
        }
        if (Object.keys(errors).length > 0) {
          setRecord(remaining);
          setRecordError(errors);
          setIsErred(true);
        } else {
          onSuccess?.();
          setIsComplete(true);
        }
      } catch (globalErr) {
        console.error('Unexpected error during submission:', globalErr);
        setIsErred(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [submit, onSuccess],
  );

  const reset = React.useCallback(() => {
    setRecord({});
    setRecordError({});
    setShowForm(true);
    setCurrentKey(undefined);
    setIsSubmitting(false);
    setIsComplete(false);
    setIsErred(false);
  }, []);

  if (isComplete) {
    return (
      <Complete
        message={successMessage}
        resetLabel={repeatLabel}
        reset={reset}
        headers={headers}
        filename={filename}
        records={Object.values(record)}
      />
    );
  }

  return (
    <Grid fluid className="multi-form">
      <Row>
        <Col span={{md: 8, xs: 20}}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </Col>

        {isErred && (
          <Col span={{md: 8, xs: 20}}>
            <div
              data-testid="error-container"
              className="border-box-0 bg-error-90 border-danger mb-4 rounded p-3"
            >
              <p className="text-error-60 body-medium-bold">
                <FormattedMessage
                  id="app.common.records.error"
                  defaultMessage="Some records could not be submitted. Please, review the data and try again."
                />
              </p>
            </div>
          </Col>
        )}

        <Col span={{md: 12, xs: 24}}>
          {Object.keys(record).map(key => (
            <div key={key}>
              <Stack justifyContent="space-around" spacing={4} className="single-row">
                <Stack.Item flex={3}>{renderItem(record[key])}</Stack.Item>

                {!showForm && !isSubmitting && (
                  <Stack.Item>
                    <ButtonToolbar wrap={false}>
                      <IconButton
                        appearance="ghost"
                        className="text-primary border-0"
                        size="xs"
                        icon={<Icon name={IconName.Edit} />}
                        onClick={() => editRecord(key)}
                      />

                      <IconButton
                        appearance="ghost"
                        className="text-danger border-0"
                        size="xs"
                        icon={<Icon name={IconName.Delete} />}
                        onClick={() => deleteRecord(key)}
                      />
                    </ButtonToolbar>
                  </Stack.Item>
                )}
              </Stack>

              {!!recordError[key] && <RowError data={recordError[key]} fieldNames={fieldNames} />}
            </div>
          ))}

          {showForm && (
            <div className="single-form">
              <Form
                record={currentRecord}
                otherRecords={otherRecords}
                onSave={saveRecord}
                onCancel={handleCancel}
              />
            </div>
          )}

          {!showForm && !isSubmitting && (
            <div>
              <Button
                appearance="link"
                className="my-2 px-0"
                startIcon={<Icon name={IconName.Add} />}
                onClick={() => setShowForm(true)}
              >
                {addLabel ?? (
                  <FormattedMessage
                    id="app.common.record.add-another"
                    defaultMessage="Add another record"
                  />
                )}
              </Button>
            </div>
          )}

          {!showForm && Object.keys(record).length > 0 && (
            <div>
              <Button
                appearance="primary"
                className="w-50"
                loading={isSubmitting}
                onClick={() => handleSubmit(record)}
              >
                {submitLabel ?? <FormattedMessage id="app.core.submit" defaultMessage="Submit" />}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Grid>
  );
};
