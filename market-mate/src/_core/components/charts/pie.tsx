import {palette} from '@core/constants/colors';
import type {Json} from '@core/types';
import React from 'react';
import {useIntl} from 'react-intl';
import {
  Label,
  Legend,
  Pie as RCPie,
  PieChart as RCPieChart,
  type PieSectorShapeProps,
  Sector,
  Tooltip,
  type TooltipProps,
} from 'recharts';

import {ChartContainer, PolarTitleAndSubtitle} from './common';

type Data = Json & {
  section?: React.SVGProps<SVGElement>;
};

type Props = {
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
  dataKey?: string;
  nameKey?: string;
  data: Data[];
  isLoading?: boolean;
};

const PieSection = (props: PieSectorShapeProps) => {
  const color = palette[props.index % palette.length];
  return <Sector {...props} fill={props.fill ?? color} />;
};

export const DoughnutChart = ({
  title,
  subtitle,
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  height = 400,
  width = 400,
  isLoading = false,
}: Props) => {
  const {formatNumber} = useIntl();

  const formatter = React.useCallback((value?: number) => formatNumber(value ?? 0), [formatNumber]);

  const isEmpty = React.useMemo(() => !data.find(entry => entry[dataKey]), [data, dataKey]);
  const pieData = React.useMemo(
    () =>
      data.map((entry, index) => ({...entry, fill: entry.fill ?? palette[index % palette.length]})),
    [data],
  );

  return (
    <div data-testid="pie-chart">
      <ChartContainer height={height} width="90%" isLoading={isLoading} isEmpty={isEmpty}>
        <RCPieChart width={width} height={height}>
          <RCPie
            data={pieData}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={85}
            outerRadius={100}
            paddingAngle={2}
            height={height}
            shape={PieSection}
          >
            <Label
              content={
                <PolarTitleAndSubtitle
                  title={title}
                  subtitle={subtitle}
                  width={width}
                  height={height}
                />
              }
            />
          </RCPie>

          <Legend />

          <Tooltip filterNull formatter={formatter as TooltipProps['formatter']} />
        </RCPieChart>
      </ChartContainer>
    </div>
  );
};

export const PieChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  height = 400,
  width = 400,
  isLoading = false,
}: Props) => {
  const isEmpty = React.useMemo(() => !data.find(entry => entry[dataKey]), [data, dataKey]);
  const pieData = React.useMemo(
    () =>
      data.map((entry, index) => ({...entry, fill: entry.fill ?? palette[index % palette.length]})),
    [data],
  );

  return (
    <div data-testid="pie-chart">
      <ChartContainer height={height} width="90%" isLoading={isLoading} isEmpty={isEmpty}>
        <RCPieChart width={width} height={height}>
          <RCPie
            data={pieData}
            dataKey={dataKey}
            nameKey={nameKey}
            outerRadius={100}
            height={height}
            shape={PieSection}
          />

          <Legend />

          <Tooltip />
        </RCPieChart>
      </ChartContainer>
    </div>
  );
};
