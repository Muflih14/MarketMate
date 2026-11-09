import type {NotificationProps} from 'rsuite/Notification';

export const ToastMode = {
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
} as const;

export type ToastMode = (typeof ToastMode)[keyof typeof ToastMode];

export const ToastSize = {
  Normal: 'normal',
  Large: 'large',
} as const;

export type ToastSize = (typeof ToastSize)[keyof typeof ToastSize];

export const ToastPlacement = {
  TopCenter: 'topCenter',
  BottomCenter: 'bottomCenter',
  TopStart: 'topStart',
  TopEnd: 'topEnd',
  BottomStart: 'bottomStart',
  BottomEnd: 'bottomEnd',
} as const;

export type ToastPlacement = (typeof ToastPlacement)[keyof typeof ToastPlacement];

export const ToastTag = {
  Message: 'message',
  Notification: 'notification',
} as const;

export type ToastTag = (typeof ToastTag)[keyof typeof ToastTag];

export type ToastOptions = NotificationProps & {
  mode?: ToastMode | null;
  size?: ToastSize | null;
  placement?: ToastPlacement | null;
  tag?: ToastTag | null;
};
