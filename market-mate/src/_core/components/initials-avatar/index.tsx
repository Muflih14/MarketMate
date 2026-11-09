import {getInitials} from '@core/utils';
import type React from 'react';
import Avatar from 'rsuite/Avatar';

type InitialsAvatarProps = Omit<React.ComponentProps<typeof Avatar>, 'children' | 'circle'> & {
  firstName?: string;
  lastName?: string;
  name?: string;
};

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  firstName,
  lastName,
  name,
  ...props
}) => {
  return (
    <Avatar {...props} circle>
      {getInitials(firstName ?? name ?? '', lastName)}
    </Avatar>
  );
};
