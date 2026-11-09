import type React from 'react';

export type BadgeProps = {
  value?: React.ReactNode;
  color?: string;
  bgColor?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'large';
};

export const Badge = ({value, color, bgColor, icon, size = 'large'}: BadgeProps) => {
  if (value == null || value === '') {
    return null;
  }

  const className = size === 'sm' ? 'body-small' : 'label';

  return (
    <span
      className={`value-container ${className} ${bgColor ? 'rounded-pill' : ''}`}
      style={{color: color ?? 'inherit', backgroundColor: bgColor}}
    >
      {icon ? <span className="me-2">{icon}</span> : null}
      {value}
    </span>
  );
};
