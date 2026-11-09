import {useIntl} from 'react-intl';

import type {ErrorProps} from './types';

export const RowError = ({data, fieldNames = {}}: ErrorProps) => {
  const {formatMessage} = useIntl();

  const {__all__: all, ...rest} = data;

  return (
    <div data-testid="record-error" className="body-small text-error-70">
      {all && (
        <ul>
          {all.map(msg => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}

      {Object.keys(rest).map(key => (
        <div key={key}>
          <div className="body-small-bold my-2">
            {fieldNames[key] ? formatMessage(fieldNames[key]) : key}
          </div>
          <ul>
            {rest[key].map(msg => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
