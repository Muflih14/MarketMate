export const getInitials = (firstName: string, lastName?: string): string => {
  const first = firstName.trim();
  const last = (lastName ?? '').trim();

  if (last) {
    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
  }

  const parts = first.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return first.slice(0, 2).toUpperCase();
};

export const omitProps = (obj: any, keys: string | string[]): any => {
  const result = {...obj};
  const props = Array.isArray(keys) ? keys : [keys];
  for (const key of props) {
    delete result[key];
  }
  return result;
};

export const getFileName = (url: string) => {
  const path = url.split('/');
  const last = path[path.length - 1];
  return last.split('?')[0];
};
