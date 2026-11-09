import React from 'react';
import IconButton from 'rsuite/IconButton';
import Stack from 'rsuite/Stack';

import {Icon, IconName} from '../icon';

type WeekFilterProps = {
  weekLabel: string;
  totalWeeks: number;
  weekIndex?: number;
  onWeekChange?: (weekIndex: number) => void;
};

export const WeekFilter: React.FC<WeekFilterProps> = ({
  weekLabel,
  totalWeeks,
  weekIndex,
  onWeekChange,
}) => {
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(weekIndex ?? 0);
  const index = weekIndex ?? uncontrolledIndex;

  const changeWeek = (nextWeekIndex: number) => {
    const next = Math.min(Math.max(nextWeekIndex, 0), Math.max(totalWeeks - 1, 0));
    if (weekIndex === undefined) {
      setUncontrolledIndex(next);
    }
    onWeekChange?.(next);
  };

  return (
    <Stack spacing={8} alignItems="center" data-testid="week-filter">
      <Stack.Item>
        <IconButton
          icon={<Icon name={IconName.ArrowBack} size="sm" className="text-primary-50" />}
          disabled={index === 0}
          onClick={() => changeWeek(index - 1)}
          appearance="subtle"
          size="sm"
          data-testid="prev-week-btn"
        />
      </Stack.Item>
      <Stack.Item>
        <span className="text-primary-50 sub-headline-small" data-testid="week-label">
          {weekLabel}
        </span>
      </Stack.Item>
      <Stack.Item>
        <IconButton
          icon={<Icon name={IconName.ArrowRight} size="sm" className="text-primary-50" />}
          disabled={index === totalWeeks - 1}
          onClick={() => changeWeek(index + 1)}
          appearance="subtle"
          size="sm"
          data-testid="next-week-btn"
        />
      </Stack.Item>
    </Stack>
  );
};
