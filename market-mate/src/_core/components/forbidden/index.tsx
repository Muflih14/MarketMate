import {FormattedMessage} from 'react-intl';

type Props = {
  message?: string;
};

const Forbidden = ({message}: Props) => {
  return (
    <div data-testid="forbidden" className="p-5 text-center">
      <span className="fa-stack fa-huge">
        <i className="fa-solid fa-user fa-stack-1x text-primary" />
        <i className="fa-solid fa-ban fa-stack-2x text-danger" />
      </span>

      <header>
        <h1 className="mt-5">
          <FormattedMessage id="app.common.forbidden" defaultMessage="Forbidden" />
        </h1>
      </header>

      <p className="mt-5">
        {message ?? ''}

        {!message && (
          <FormattedMessage
            id="app.common.forbidden.message"
            defaultMessage="You don’t have permission to access this resource."
          />
        )}
      </p>
    </div>
  );
};

export default Forbidden;
