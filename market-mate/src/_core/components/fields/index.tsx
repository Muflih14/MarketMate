import {emptyValue} from '@core/constants/texts';
import type React from 'react';
import Col from 'rsuite/Col';

export type FieldProps = {
  key: string;
  label: React.ReactNode;
  value?: React.ReactNode;
};

export const Field = ({label, value}: FieldProps) => (
  <Col span={{md: 8, xs: 12}} className="mb-3">
    <p className="label">{label}</p>
    <p className="value">{value ?? emptyValue}</p>
  </Col>
);
