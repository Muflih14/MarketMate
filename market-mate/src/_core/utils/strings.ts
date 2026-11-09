export const truncate = (text: string, length = 30): string => {
  const value = text ?? '';
  if (value.length < length) {
    return value;
  }

  return `${value.substring(0, length)}…`;
};
