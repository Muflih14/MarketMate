import React from 'react';
import Message from 'rsuite/Message';
import Notification from 'rsuite/Notification';

import {AlertIcon} from '../alert-icon';
import {ToastMode, type ToastOptions, ToastSize, ToastTag} from './types';

type WrapperProps = React.PropsWithChildren<{
  size?: ToastSize;
  mode: ToastMode;
}>;

const Wrapper = ({size, mode, children}: WrapperProps) => {
  if (size === ToastSize.Normal) {
    return (
      <div className="notification">
        <AlertIcon size="small" mode={mode} />
        {children}
      </div>
    );
  }

  return (
    <div className="notification-large">
      <AlertIcon size="large" mode={mode} />
      <div className="content">
        <h3>{children}</h3>
      </div>
    </div>
  );
};

type ToastProps = React.PropsWithChildren<ToastOptions>;

export const Toast = React.forwardRef(({children, tag, ...props}: ToastProps, ref) => {
  const mode = props.mode ?? ToastMode.Info;
  const size = props.size ?? ToastSize.Normal;
  const header = size === ToastSize.Normal ? '' : props.header;

  if (tag === ToastTag.Message) {
    return (
      <Message showIcon type={mode} {...props} ref={ref}>
        {children}
      </Message>
    );
  }

  return (
    <Notification {...props} header={header} ref={ref}>
      <Wrapper size={size} mode={mode}>
        {children}
      </Wrapper>
    </Notification>
  );
});

Toast.displayName = 'Toast';
