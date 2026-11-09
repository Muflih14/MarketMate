export const DateInterval = {
  Day: 'd',
  Month: 'm',
  Range: 'r',
} as const;

export type DateInterval = (typeof DateInterval)[keyof typeof DateInterval];

export type FiltersState = {
  allowFuture: boolean;
  dateInterval: DateInterval;
  dates?: [Date, Date];
};

export const getInitialFiltersState = (): FiltersState => ({
  allowFuture: true,
  dateInterval: DateInterval.Month,
});
