import {FormattedMessage} from 'react-intl';

const Wip = () => {
  return (
    <div data-testid="wip" className="p-5">
      <i className="fa-solid fa-person-digging fa-huge text-primary" />

      <header>
        <h1 className="mt-5">
          <FormattedMessage id="app.common.wip" defaultMessage="Developers at work" />
        </h1>
      </header>

      <p className="mt-5">
        <FormattedMessage
          id="app.common.wip.message"
          defaultMessage="We are currently working on this task."
        />
      </p>

      <p>
        <FormattedMessage id="app.common.please-patient" defaultMessage="Please, be patient." />
      </p>
    </div>
  );
};

export default Wip;
