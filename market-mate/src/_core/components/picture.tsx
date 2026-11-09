import {getFileName} from '@core/utils';
import React from 'react';
import Avatar from 'rsuite/Avatar';
import Modal from 'rsuite/Modal';

type Props = {
  picture?: string;
};

export const Picture: React.FC<Props> = ({picture}) => {
  const [open, setOpen] = React.useState(false);

  const name = React.useMemo(() => (picture ? getFileName(picture) : undefined), [picture]);

  const hide = () => setOpen(false);
  const show = () => setOpen(true);

  if (!picture) {
    return null;
  }

  return (
    <div data-testid="driver-picture">
      <Avatar
        circle
        size="xxl"
        className="picture xxxxl"
        src={picture}
        alt={name}
        title={name}
        onClick={show}
      />

      {open && (
        <Modal overflow open={open} onClose={hide} size="lg">
          <Modal.Header>
            <Modal.Title>{name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <img alt={name} title={name} src={picture} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};
