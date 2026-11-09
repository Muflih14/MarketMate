import type {Json} from '@core/types';
import {truncate} from '@core/utils/strings';
import range from 'lodash-es/range';
import React from 'react';
import {useIntl} from 'react-intl';
import {
  Bar,
  BarChart,
  type BarProps,
  CartesianGrid,
  Legend,
  Tooltip,
  type TooltipProps,
} from 'recharts';

import {ChartContainer, DataAxis, NameAxis} from './common';

type ChartBar = Omit<BarProps, 'ref'> & {key: string};

type Props = {
  layout?: 'horizontal' | 'vertical';
  data?: Json[];
  nameKey?: string;
  bars: ChartBar[];
  barSize?: number;
  width?: number;
  height?: number;
  topMargin?: number;
  bottomMargin?: number;
  leftMargin?: number;
  rightMargin?: number;
  showLegend?: boolean;
  isLoading?: boolean;
};

const tickFormatter = (value: string, _index: number) => truncate(value, 12);

const Chart = ({
  layout = 'horizontal',
  data = [],
  nameKey = 'name',
  bars,
  barSize = 8,
  width = 400,
  height = 400,
  topMargin = 10,
  bottomMargin = 10,
  leftMargin = 10,
  rightMargin = 10,
  showLegend = false,
  isLoading = false,
}: Props) => {
  const {formatNumber} = useIntl();

  const formatter = React.useCallback((value?: number) => formatNumber(value ?? 0), [formatNumber]);

  // find out number of data axis
  const dataAxisCount = React.useMemo(() => {
    // count bars without stackId
    const barsCount = bars.filter(bar => !bar.stackId).length;
    // count stackId values
    const stacksCount = new Set(bars.map(bar => bar.stackId).filter(val => val)).size;

    return barsCount + stacksCount;
  }, [bars]);

  const legendStyle = React.useMemo(() => (showLegend ? {marginTop: -40} : {}), [showLegend]);
  const chartMargin = React.useMemo(
    () => ({
      top: topMargin + (showLegend ? 30 : 0),
      right: rightMargin,
      bottom: bottomMargin,
      left: leftMargin,
    }),
    [topMargin, rightMargin, bottomMargin, leftMargin, showLegend],
  );

  return (
    <ChartContainer height={height + 20} width="95%" isLoading={isLoading} isEmpty={!data?.length}>
      <BarChart
        data={data}
        layout={layout}
        barSize={barSize}
        width={width}
        height={height}
        margin={chartMargin}
      >
        <Tooltip filterNull formatter={formatter as TooltipProps['formatter']} />

        <CartesianGrid vertical={layout === 'vertical'} horizontal={layout === 'horizontal'} />

        <NameAxis
          layout={layout}
          dataKey={nameKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
        />

        {range(0, dataAxisCount).map(val => (
          <DataAxis
            layout={layout}
            key={val}
            type="number"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatter}
          />
        ))}

        {bars.map(bar => (
          <Bar {...bar} key={bar.key} />
        ))}

        {showLegend && (
          <Legend
            align="left"
            height={36}
            verticalAlign="top"
            iconType="rect"
            wrapperStyle={legendStyle}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
};

export const VerticalBarChart = (props: Props) => {
  return (
    <div data-testid="vertical-bar-chart">
      <Chart {...props} layout="vertical" />
    </div>
  );
};

export const HorizontalBarChart = (props: Props) => {
  return (
    <div data-testid="horizontal-bar-chart">
      <Chart {...props} layout="horizontal" />
    </div>
  );
};
