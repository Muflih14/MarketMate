import type React from 'react';
import Avatar from 'rsuite/Avatar';

// https://fonts.google.com/icons?icon.set=Material+Icons&icon.style=Outlined

export const IconName = {
  Success: 'check',
  Error: 'close',
  Info: 'priority_high',
  Warning: 'warning_amber',
  Filter: 'filter_alt',
  Export: 'file_upload',
  Search: 'search',
  DropDown: 'keyboard_arrow_down',
  NoData: 'grid_off',
  More: 'more_horiz',
  Plus: 'add',
  Minus: 'remove',
  Ok: 'check_circle_outline',
  Add: 'add',
  Delete: 'delete',
  Edit: 'edit',
  Clear: 'clear',
  ArrowRight: 'arrow_right_alt',
  ArrowBack: 'arrow_back',
  Camera: 'camera_alt',
  Coordinates: 'location_on',
};

export type IconSize =
  | 'small'
  | 'sm'
  | 's'
  | 'medium'
  | 'md'
  | 'm'
  | 'large'
  | 'lg'
  | 'l'
  | 'xlarge'
  | 'xl'
  | 'xxlarge'
  | 'xxl'
  | 'xxxlarge'
  | 'xxxl'
  | 'xxxxlarge'
  | 'xxxxl';

type IconProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  circle?: boolean;
  className?: string;
  label?: string;
  name?: string;
  size?: IconSize;
  onClick?: () => void;
};

const Icon2 = ({className = '', name, ...props}: IconProps) => (
  <span {...props} className={`material-icons ${className}`}>
    {name}
  </span>
);

export const Icon = ({circle, className, label, name, size, onClick, ...props}: IconProps) => {
  if (!name) {
    return;
  }

  const iconProps = {...props, className: `${size ?? ''} ${className ?? ''}`, name};
  if (circle) {
    return (
      <Avatar circle alt={label} className={size} onClick={onClick}>
        <Icon2 {...iconProps} />
      </Avatar>
    );
  }
  return <Icon2 {...iconProps} />;
};
