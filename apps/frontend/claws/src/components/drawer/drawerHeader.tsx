import Image from 'next/image';

import close from '../../../public/assets/drawer/close.svg';

type HeaderProps = {
  title: string;
  toggleDrawer: () => void;
};

export default function DrawerHeader({ title, toggleDrawer }: HeaderProps) {
  return (
    <div className="flex ml-[184px] items-center w-full h-8 mt-[19px] mx-7">
      <p>{title}</p>
      <button onClick={toggleDrawer}>
        <Image src={close} alt={'close button'} className="ml-[132px]" />
      </button>
    </div>
  );
}
