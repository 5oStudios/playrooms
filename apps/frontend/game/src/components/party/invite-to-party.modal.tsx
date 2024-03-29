import React from 'react';

import { Button, ModalContent } from '@nextui-org/react';
import QRCode from 'react-qr-code';

import BaseModal from '../modals/base.modal';

export const InviteToParty = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const inviteLink = new URL(window.location.href).toString();
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={'xs'}>
      <ModalContent className={'gap-3'}>
        <QRCode
          size={128}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={inviteLink}
          viewBox={`0 0 256 256`}
        />
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(inviteLink);
            onClose();
          }}
          className={'w-full'}
        >
          Copy Link
        </Button>
      </ModalContent>
    </BaseModal>
  );
};
