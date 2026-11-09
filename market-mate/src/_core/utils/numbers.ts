export const parseDecimal = (value?: string) => {
  const val = Number.parseFloat(value ?? '');
  return Number.isNaN(val) ? 0.0 : val;
};

const parseInteger = (value?: string) => {
  const val = Number.parseInt(value ?? '', 10);
  return Number.isNaN(val) ? 0 : val;
};

export const parsePositiveInt = (value?: string) => {
  const val = parseInteger(value);
  return val < 0 ? 0 : val;
};
