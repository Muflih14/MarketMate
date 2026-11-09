export const getSetValues = (set: Set<string>): string => {
  const entries = [...set];

  if (entries.length === 0) {
    return '';
  }

  const firstItem = entries[0].toString();
  if (entries.length === 1) {
    return firstItem;
  }

  return `${firstItem} +${entries.length - 1}`;
};
