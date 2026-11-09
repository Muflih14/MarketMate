import type {IdValue, Json} from '@core/types';
import Checkbox from 'rsuite/Checkbox';
import RSTable, {type CellProps} from 'rsuite/Table';

import type {TableData} from './types';

type CheckedHeaderProps<T extends Json = Json> = {
  dataKey?: string;
  data: readonly TableData<T>[];
  setKeys: (values: IdValue[]) => void;
};

type CheckedCellProps<T extends Json = Json> = CellProps<T> & {
  keys: IdValue[];
  setKeys: (values: IdValue[]) => void;
};

export const CheckHeader = <T extends Json = Json>({
  dataKey = 'id',
  data = [],
  setKeys,
}: CheckedHeaderProps<T>) => {
  const handleChange = (_value?: IdValue, checked?: boolean) => {
    const keys = checked ? data.map(item => item[dataKey]) : [];
    setKeys(keys);
  };

  return (
    <div className="d-print-none" style={{lineHeight: '40px'}}>
      <Checkbox inline onChange={handleChange} />
    </div>
  );
};

export const CheckCell = <T extends Json = Json>({
  rowData = {} as TableData<T>,
  dataKey = 'id',
  keys,
  setKeys,
  ...props
}: CheckedCellProps<T>) => {
  const cellId = rowData ? rowData[dataKey] : '';

  const handleChange = (value?: IdValue, checked?: boolean) => {
    if (value == null || value === '') {
      return;
    }

    const newKeys = checked ? [...keys, value] : keys.filter((item: IdValue) => item !== value);
    setKeys(newKeys);
  };

  return (
    <RSTable.Cell {...props} className="d-print-none" style={{padding: 0}}>
      <div style={{lineHeight: '46px'}}>
        <Checkbox
          value={cellId}
          inline
          onChange={handleChange}
          checked={keys.some((item: IdValue) => item === cellId)}
        />
      </div>
    </RSTable.Cell>
  );
};
