'use client';
import React from 'react';
import { Modal, ModalProps } from '@nextui-org/react';

export default function BaseModal(props: ModalProps) {
  return (
    <>
      <Modal
        backdrop={'blur'}
        placement={'center'}
        className={'flex justify-center items-center p-4 m-4'}
        {...props}
      >
        {props.children}
      </Modal>
    </>
  );
}
