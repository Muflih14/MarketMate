import type React from 'react';
import Loader, {type LoaderProps} from 'rsuite/Loader';

import NotFound from '../not-found';

type Props = LoaderProps & {
  isLoading?: boolean;
  loadingMessage?: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: React.ReactNode;
};

const IsLoading = ({
  isLoading = false,
  loadingMessage,
  isEmpty = false,
  emptyMessage,
  children,
  ...props
}: React.PropsWithChildren<Props>) => {
  if (isLoading) {
    return (
      <div data-testid="loading" className="m-5 p-5 text-center">
        <Loader size="lg" content={loadingMessage} vertical {...props} />
      </div>
    );
  }

  if (isEmpty) {
    return <NotFound message={emptyMessage} />;
  }

  return children;
};

export default IsLoading;
