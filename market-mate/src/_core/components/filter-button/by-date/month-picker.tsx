import DatePicker from 'rsuite/DatePicker';
import Form from 'rsuite/Form';

export const MonthPicker = ({value, allowFuture: _allowFuture, ...props}: any) => {
  return (
    <Form.Control
      {...props}
      data-testid="month-picker"
      accepter={DatePicker}
      format="MMM yyyy"
      value={value?.[0]}
    />
  );
};
