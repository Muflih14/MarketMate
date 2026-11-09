import type {Json} from '@core/types';
import React from 'react';
import {useIntl} from 'react-intl';
import {useNavigate, useParams} from 'react-router';
import Nav from 'rsuite/Nav';
import Panel from 'rsuite/Panel';

import type {TabbedProps, TabProps} from './types';

/**
 * Tabbed component
 *
 * @returns ReactNode
 */
export const TabbedPanel = <
  Tab extends string = string,
  T extends Json = Json,
  E extends Json = Json,
>({
  tabs,
  defaultTab,
  getTabPath,
  hideTabs = false,
  appearance = 'tabs',
  justified = false,
  hideBorder = false,
  ...props
}: TabbedProps<Tab, T, E>) => {
  const {formatMessage} = useIntl();
  const navigate = useNavigate();
  const {tab: paramTab} = useParams() as {tab?: Tab};

  const [tab, setTab] = React.useState<Tab>(defaultTab);

  const selectTab = React.useCallback(
    (newTab: Tab) => {
      navigate(getTabPath(newTab), {replace: true});
      setTimeout(() => setTab(newTab), 1);
    },
    [navigate, getTabPath],
  );

  React.useEffect(() => {
    if (paramTab !== tab) {
      if (paramTab && tabs[paramTab]) {
        selectTab(paramTab);
      } else {
        selectTab(defaultTab);
      }
    }
  }, [selectTab, defaultTab, tabs, tab, paramTab]);

  const currentTab = React.useMemo(() => tabs[tab], [tabs, tab]);
  const tabProps = (currentTab?.props ?? {}) as T;
  const componentProps = {...props, ...tabProps} as TabProps<T & E>;

  const Component = currentTab?.component;

  return (
    <>
      {!hideTabs && (
        <Nav
          appearance={appearance}
          activeKey={tab}
          onSelect={selectTab}
          justified={justified}
          className="d-print-none"
        >
          {Object.keys(tabs).map(key => (
            <Nav.Item key={key} eventKey={key} className="tab-header">
              {formatMessage(tabs[key as Tab]?.name ?? {})}
            </Nav.Item>
          ))}
        </Nav>
      )}

      <Panel bordered={!hideBorder && !hideTabs} className="with-nav">
        {!!Component && <Component {...componentProps} />}
      </Panel>
    </>
  );
};
