import type React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
  message?: React.ReactNode;
};

const NotFound = ({message}: Props) => {
  return (
    <div data-testid="not-found" className="p-5 text-center">
      <span className="fa-stack fa-huge">
        <i className="fa-solid fa-box-open fa-stack-1x text-primary" />
        <i className="fa-solid fa-ban fa-stack-2x text-danger" />
      </span>

      <header>
        <h1 className="mt-5">
          <FormattedMessage id="app.common.not-found" defaultMessage="Not found" />
        </h1>
      </header>

      <p className="mt-5">
        {message ?? ''}

        {!message && (
          <FormattedMessage
            id="app.common.data.not-found"
            defaultMessage="Requested data not found."
          />
        )}
      </p>
    </div>
  );
};

export default NotFound;
