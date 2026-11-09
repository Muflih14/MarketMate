export type Dict = Record<string, string>;
export type DictOf<T> = Record<string, T>;

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type Json = DictOf<any>;

export type IdValue = number | string;

export type ExportableValue = string | number | boolean | null | undefined;

export type DateLikewise = number | string | Date;

export type OptionalString = string | undefined | null;
