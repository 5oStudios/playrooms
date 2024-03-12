import React from 'react';
import { cn, Modal, ModalProps } from '@nextui-org/react';

const Drawer: React.FC<ModalProps> = ({ ...props }) => {
  return (
    <Modal
      {...props}
      scrollBehavior="inside"
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      backdrop="transparent"
      size="full"
      classNames={{
        wrapper: 'flex justify-end',
      }}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            x: 50,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      className={cn(
        'rounded-md max-w-sm w-full h-screen max-h-screen',
        props.className
      )}
    >
      <>{props.children}</>
    </Modal>
  );
};

export default Drawer;
