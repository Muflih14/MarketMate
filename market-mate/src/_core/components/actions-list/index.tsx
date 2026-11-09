import type {ButtonColor} from '@core/types';
import type React from 'react';
import Button from 'rsuite/Button';
import Dropdown from 'rsuite/Dropdown';
import Popover from 'rsuite/Popover';
import Stack from 'rsuite/Stack';
import Whisper, {type WhisperProps} from 'rsuite/Whisper';

import {Icon} from '../icon';

export type ActionsVariant = 'buttons' | 'dropdown';

/**
 * Represents an action that can be rendered in the ActionsList component.
 * @property {string} key - A unique key for the action.
 * @property {React.ReactNode} label - The label of the action.
 * @property {RSTypeAttributes.Color} color - The color of the action.
 * @property {string} iconName - The icon name of the action.
 * @property {() => void} onClick - The function to be called when the action is clicked.
 * @property {boolean} disabled - Whether the action is disabled.
 */
export type Action = {
  key: string;
  label: React.ReactNode;
  color?: ButtonColor;
  iconName?: string;
  onClick: () => void;
  disabled?: boolean;
};

type ActionProps = React.PropsWithChildren<{actions: Action[]}>;

/**
 * Renders a list of actions as buttons.
 *
 * @param {object} props - The props passed to the component.
 * @param {Action[]} props.actions - The actions to be rendered.
 */
const ActionButtons = ({actions}: ActionProps) => {
  return (
    <Stack direction="row" spacing={5} className="d-print-none">
      {actions.map(action => (
        <Stack.Item key={action.key}>
          <Button
            appearance="primary"
            key={action.key}
            color={action.color}
            onClick={action.onClick}
          >
            {!!action.iconName && <Icon name={action.iconName} className="me-2" />}

            {action.label}
          </Button>
        </Stack.Item>
      ))}
    </Stack>
  );
};

/**
 * Renders a list of actions as a dropdown menu.
 *
 * @param {object} props - The props passed to the component.
 * @param {Action[]} props.actions - The actions to be rendered.
 * @param {React.ReactNode} props.children - The children components to be rendered.
 */
const ActionDropdown = ({actions, children}: ActionProps) => {
  const speaker: WhisperProps['speaker'] = ({onClose, left, top, className}, ref) => (
    <Popover ref={ref} className={className} style={{left, top}} full arrow={false}>
      <Dropdown.Menu
        className="d-print-none"
        onSelect={(eventKey?: string | number) => {
          onClose?.();
          actions.find(action => action.key === eventKey)?.onClick();
        }}
      >
        {actions.map(action => (
          <Dropdown.Item key={action.key} eventKey={action.key}>
            {action.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Popover>
  );

  return (
    <Whisper placement="bottomEnd" trigger="click" speaker={speaker}>
      {children as React.ReactElement}
    </Whisper>
  );
};

type Props = {actions: Action[]; variant?: ActionsVariant};

type ActionsListProps = React.PropsWithChildren<Props>;

/**
 * Renders a list of actions. The actions can be displayed as either a dropdown menu or a list of buttons.
 *
 * @param {object} props - The props passed to the component.
 * @param {Action[]} props.actions - The actions to be rendered.
 * @param {React.ReactNode} props.children - The children components to be rendered.
 * @param {ActionsVariant} [props.variant='dropdown'] - The variant of the actions list to be rendered. Defaults to 'dropdown'.
 */
export const ActionsList = ({actions, children, variant = 'dropdown'}: ActionsListProps) => {
  const ActionComponent = variant === 'buttons' ? ActionButtons : ActionDropdown;

  return (
    <ActionComponent actions={actions.filter(action => !action.disabled)}>
      {children}
    </ActionComponent>
  );
};
