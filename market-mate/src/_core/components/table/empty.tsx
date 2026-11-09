import {FormattedMessage} from 'react-intl';
import Stack from 'rsuite/Stack';

import {AlertIcon} from '../alert-icon';
import {IconName} from '../icon';

const Empty = () => {
  return (
    <Stack
      className="m-3 h-75"
      alignItems="center"
      justifyContent="center"
      direction="column"
      spacing={15}
    >
      <Stack.Item>
        <AlertIcon icon={IconName.NoData} mode="info" />
      </Stack.Item>

      <Stack.Item>
        <h4>
          <FormattedMessage id="table.empty.title" defaultMessage="No available data." />
        </h4>
      </Stack.Item>

      <Stack.Item>
        <FormattedMessage
          id="table.empty.message"
          defaultMessage="Try changing the filters or search term applied."
        />
      </Stack.Item>
    </Stack>
  );
};

export default Empty;
