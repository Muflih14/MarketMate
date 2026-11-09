import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import AutoComplete, {type AutoCompleteProps} from 'rsuite/AutoComplete';
import Form from 'rsuite/Form';
import InputGroup from 'rsuite/InputGroup';
import Loader from 'rsuite/Loader';

import {Icon, IconName} from '../../icon';
import {FormGroup, type FormGroupProps} from './group';
import {getControlProps} from './utils';

const messages = defineMessages({
  search: {id: 'app.core.search', defaultMessage: 'Search'},
});

export type AutoCompleteFieldProps<T = string> = AutoCompleteProps<T> &
  FormGroupProps<T> & {
    loading?: boolean;
    /** Shows a search button; it and the Enter key call this handler. */
    onSearchSubmit?: () => void;
    /** Disables the search button and Enter submit, e.g. when the input is too short. */
    searchDisabled?: boolean;
  };

export const AutoCompleteField = <T = string,>(props: AutoCompleteFieldProps<T>) => {
  const {loading, onSearchSubmit, searchDisabled, ...restProps} = props;
  const {formatMessage} = useIntl();
  const optionSelected = React.useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onSearchSubmit || e.key !== 'Enter' || e.nativeEvent.isComposing) {
      return;
    }
    // Keep Enter from submitting the surrounding form
    e.preventDefault();
    // Enter picked a highlighted option, which is not a new search
    if (!searchDisabled && !optionSelected.current) {
      onSearchSubmit();
    }
  };

  const control = (
    <Form.Control
      {...getControlProps(restProps)}
      accepter={AutoComplete}
      onSelect={(...args: Parameters<NonNullable<typeof restProps.onSelect>>) => {
        optionSelected.current = true;
        restProps.onSelect?.(...args);
      }}
    />
  );

  if (!loading && !onSearchSubmit) {
    return <FormGroup {...restProps}>{control}</FormGroup>;
  }

  return (
    <FormGroup {...restProps}>
      <InputGroup
        inside
        onKeyDownCapture={() => {
          optionSelected.current = false;
        }}
        onKeyDown={handleKeyDown}
      >
        {control}
        {loading && (
          <InputGroup.Addon>
            <Loader size="xs" />
          </InputGroup.Addon>
        )}
        {onSearchSubmit && (
          <InputGroup.Button
            appearance="subtle"
            size="sm"
            aria-label={formatMessage(messages.search)}
            data-testid="autocomplete-search-btn"
            disabled={searchDisabled}
            onMouseDown={event => event.preventDefault()}
            onClick={onSearchSubmit}
          >
            <Icon name={IconName.Search} size="sm" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </FormGroup>
  );
};
