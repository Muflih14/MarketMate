import {colors} from '@core/constants/colors';
import {parsePositiveInt} from '@core/utils/numbers';
import type React from 'react';
import {type LabelProps, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import type {Percent, RenderableAxisProps} from 'recharts/types/util/types';
import Loader from 'rsuite/Loader';

type Props = LabelProps & {
  title?: string;
  subtitle?: string;
};

export const PolarTitleAndSubtitle = (props: Props) => {
  const {title, subtitle, viewBox, offset = 5, width = 400, height = 400} = props;
  if (!title) {
    return null;
  }

  const isPolar = viewBox && 'cx' in viewBox;
  const isCartesian = viewBox && 'x' in viewBox;

  // get center coordinates from viewBox
  const cx = isPolar ? viewBox.cx : isCartesian ? viewBox.x + viewBox.width / 2 : undefined;
  const cy = isPolar ? viewBox.cy : isCartesian ? viewBox.y + viewBox.height / 2 : undefined;

  // get default sizes
  const w = parsePositiveInt(`${width}`);
  const h = parsePositiveInt(`${height}`);
  const o = parsePositiveInt(`${offset}`);

  // texts coordinates
  const x = cx ?? w / 2 - o;
  const y = cy ?? h / 2 - o;

  return (
    <g>
      <text
        textAnchor="middle"
        x={x}
        y={y - (subtitle ? 25 : 0)}
        fill={colors.textColor}
        className="recharts-text headline-large"
      >
        {title}
      </text>

      {subtitle && (
        <text
          textAnchor="middle"
          x={x}
          y={y}
          fill={colors.textColor}
          className="recharts-text label-medium"
        >
          {subtitle}
        </text>
      )}
    </g>
  );
};

type ContainerProps = {
  height?: number | Percent;
  width?: number | Percent;
  isLoading?: boolean;
  isEmpty?: boolean;
  children: React.ReactElement;
};

export const ChartContainer = ({
  height = 400,
  width = 400,
  isLoading = false,
  isEmpty = false,
  children,
}: ContainerProps) => {
  if (isLoading) {
    return <Loader className="in-chart" style={{height, width}} />;
  }

  if (isEmpty) {
    return (
      <span className="fa-stack fa-huge in-chart" style={{height, width}}>
        <i className="fa-solid fa-database fa-stack-1x text-neutral-90" />
        <i className="fa-solid fa-ban fa-stack-2x text-neutral-95" />
      </span>
    );
  }

  return (
    <ResponsiveContainer height={height} width={width}>
      {children}
    </ResponsiveContainer>
  );
};

type AxisProps = {layout: 'vertical' | 'horizontal'} & RenderableAxisProps<any, any>;

export const NameAxis = ({layout, ...props}: AxisProps) => {
  if (layout === 'vertical') {
    return <YAxis {...props} />;
  }
  return <XAxis {...props} />;
};

export const DataAxis = ({layout, ...props}: AxisProps) => {
  if (layout === 'vertical') {
    return <XAxis {...props} />;
  }
  return <YAxis {...props} />;
};
