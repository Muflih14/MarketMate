import {DateInterval, type FiltersState, getInitialFiltersState} from '@core/types/filters';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Button from 'rsuite/Button';
import Drawer from 'rsuite/Drawer';
import Form from 'rsuite/Form';
import Panel from 'rsuite/Panel';

import {Icon, IconName} from '../icon';
import {FilterByDate} from './by-date';
import type {FilterButtonProps} from './types';

type Props = FilterButtonProps & {
  value?: FiltersState;
  onApply?: (state: FiltersState) => void;
  onClear?: () => void;
};

const withDayOnly = (filters: FiltersState, dayOnly?: boolean): FiltersState =>
  dayOnly ? {...filters, dateInterval: DateInterval.Day} : filters;

export const FilterButton = (props: Props) => {
  const {hideDates = false, value, onApply, onClear} = props;
  const filters = value ?? getInitialFiltersState();

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<FiltersState>(() => withDayOnly(filters, props.dayOnly));

  const onChange = React.useCallback(
    (key: keyof FiltersState, next: FiltersState[keyof FiltersState]) => {
      setState(current => ({...current, [key]: next}));
    },
    [],
  );

  const onOpen = React.useCallback(
    () => setState(withDayOnly(filters, props.dayOnly)),
    [filters, props.dayOnly],
  );
  const onClose = React.useCallback(() => setOpen(false), []);

  const clearFilter = () => {
    const next = withDayOnly(getInitialFiltersState(), props.dayOnly);
    setState(next);
    onClose();
    onClear?.();
  };
  const applyFilter = () => {
    onClose();
    onApply?.(state);
  };

  const filterProps = {...props, value: state, onChange};

  return (
    <>
      <Button
        data-testid="filter-button"
        className="filter-button d-print-none"
        appearance="ghost"
        onClick={() => setOpen(true)}
      >
        <Icon name={IconName.Filter} />
        <FormattedMessage id="app.common.filter" defaultMessage="Filter" />
      </Button>

      <Drawer
        data-testid="filter-drawer"
        placement="right"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        size="xs"
      >
        <Drawer.Header data-testid="drawer-header">
          <Drawer.Title data-testid="drawer-title">
            <FormattedMessage id="app.common.filters" defaultMessage="Filters" />
          </Drawer.Title>

          <Drawer.Actions data-testid="drawer-actions">
            <Button data-testid="clear-button" appearance="ghost" onClick={clearFilter}>
              <FormattedMessage id="app.common.clear" defaultMessage="Clear" />
            </Button>

            <Button data-testid="apply-button" appearance="primary" onClick={applyFilter}>
              <FormattedMessage id="app.common.apply" defaultMessage="Apply" />
            </Button>
          </Drawer.Actions>
        </Drawer.Header>

        <Drawer.Body data-testid="drawer-body" className="filter-panel">
          <Panel data-testid="filter-panel" bodyFill>
            <Form
              data-testid="filter-form"
              fluid
              layout="vertical"
              formValue={state}
              onChange={next => setState(next as FiltersState)}
            >
              {!hideDates && <FilterByDate {...filterProps} allowFuture={filters.allowFuture} />}
            </Form>
          </Panel>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
