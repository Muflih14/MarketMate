import type {Json} from '@core/types';
import {truncate} from '@core/utils/strings';
import React from 'react';
import {useIntl} from 'react-intl';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  type LineProps,
  Tooltip,
  type TooltipProps,
} from 'recharts';

import {ChartContainer, DataAxis, NameAxis} from './common';

type ChartLine = Omit<LineProps, 'ref'> & {key: string};

type Props = {
  layout?: 'horizontal' | 'vertical';
  data?: Json[];
  nameKey?: string;
  lines: ChartLine[];
  lineSize?: number;
  width?: number;
  height?: number;
  topMargin?: number;
  bottomMargin?: number;
  leftMargin?: number;
  rightMargin?: number;
  showLegend?: boolean;
  isLoading?: boolean;
};

const tickFormatter = (value: string | number, _index: number) => truncate(String(value), 15);

const Chart = ({
  layout = 'horizontal',
  data = [],
  nameKey = 'name',
  lines,
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
      <LineChart data={data} layout={layout} width={width} height={height} margin={chartMargin}>
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

        {lines.map(line => (
          <DataAxis
            layout={layout}
            key={line.key}
            type="number"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatter}
          />
        ))}

        {lines.map(line => (
          <Line {...line} key={line.key} />
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
      </LineChart>
    </ChartContainer>
  );
};

export const VerticalLineChart = (props: Props) => {
  return (
    <div data-testid="vertical-line-chart">
      <Chart {...props} layout="vertical" />
    </div>
  );
};

export const HorizontalLineChart = (props: Props) => {
  return (
    <div data-testid="horizontal-line-chart">
      <Chart {...props} layout="horizontal" />
    </div>
  );
};
