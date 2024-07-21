import Image from 'next/image';

import close from '../../../public/assets/drawer/close.svg';

type HeaderProps = {
  title: string;
  toggleDrawer: () => void;
  className?: string;
};

export default function DrawerHeader({
  title,
  toggleDrawer,
}: HeaderProps) {
  return (
    <div className="relative flex items-center justify-center w-full h-8 mt-[19px] ">
      <p>{title}</p>
      <button onClick={toggleDrawer}>
        <Image
          src={close}
          alt={'close button'}
          className={"absolute right-10 top-3"}
        />
      </button>
    </div>
  );
}
