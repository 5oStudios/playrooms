import React from 'react';

import { Checkbox, Chip, User, cn } from '@nextui-org/react';

export const PlatformCheckbox = (platform: {
  id: string;
  title: string;
  logo: string;
  description: string;
  active: boolean;
}) => {
  return (
    <Checkbox
      isDisabled={!platform.active}
      aria-label={platform.title}
      classNames={{
        base: cn(
          'inline-flex min-w-full bg-content1 m-0',
          'hover:bg-content2 items-center justify-start',
          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
        label: 'w-full',
      }}
      value={platform.id}
    >
      <div className="w-full flex justify-between gap-2">
        <User
          avatarProps={{ size: 'md', src: platform.logo }}
          description={platform.description}
          name={platform.title}
        />
        <div className="flex flex-col items-end gap-1">
          <Chip
            color={platform.active ? 'success' : 'warning'}
            size="sm"
            variant="flat"
          >
            {platform.active ? 'Active' : 'Not Active'}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
};
