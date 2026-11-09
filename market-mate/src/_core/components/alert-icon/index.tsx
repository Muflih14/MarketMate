import type {Json} from '@core/types';

import {Icon, IconName} from '../icon';

type Props = {
  icon?: string;
  mode?: string;
  size?: 'small' | 'large';
};

const iconByMode: Json = {
  danger: IconName.Error,
  error: IconName.Error,
  info: IconName.Info,
  success: IconName.Success,
  warning: IconName.Warning,
};

export const AlertIcon = ({icon, mode = '', size = 'large'}: Props) => {
  const iconName = icon ?? iconByMode[mode] ?? IconName.Info;

  return (
    <div className={`alert-icon-outer ${size} ${mode}`}>
      <div className={`alert-icon-inner ${size} ${mode}`}>
        <Icon size={size} name={iconName} />
      </div>
    </div>
  );
};
