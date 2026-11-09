import type {IdValue, Json} from '@core/types';
import type React from 'react';
import type {MessageDescriptor} from 'react-intl';

export type TabProps<T extends Json = Json> = T & {
  id: IdValue;
  filename: string;
};

export type TabValue<T extends Json = Json, E extends Json = Json> = {
  name: MessageDescriptor;
  component: React.FC<TabProps<T & E>>;
  props?: T;
};

export type TabbedProps<
  Tab extends string = string,
  T extends Json = Json,
  E extends Json = Json,
> = TabProps<E> & {
  tabs: Partial<Record<Tab, TabValue<T, E>>>;
  defaultTab: Tab;
  getTabPath: (tab: Tab) => string;
  hideTabs?: boolean;
  appearance?: 'default' | 'subtle' | 'tabs';
  justified?: boolean;
  hideBorder?: boolean;
};
