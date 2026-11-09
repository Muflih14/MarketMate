import type {FiltersState} from '@core/types/filters';

export type FilterButtonProps = {
  allowFuture?: boolean;
  hideDates?: boolean;
  dayOnly?: boolean;
};

export type FilterByProps = Partial<FilterButtonProps> & {
  value: FiltersState;
  onChange: (key: keyof FiltersState, val: any) => void;
};
