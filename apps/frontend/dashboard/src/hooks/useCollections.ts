import { useState } from 'react';

import { IUser } from '@components/header';
import { Permission, Role } from '@refinedev/appwrite';
import { useGetIdentity } from '@refinedev/core';

export enum CollectionType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum CollectionStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export function useCollections() {
  const { data: user } = useGetIdentity<IUser>();
  const [permissions, setPermissions] = useState<{
    readPermissions?: Permission[];
    writePermissions?: Permission[];
  }>({
    readPermissions: [Permission.read(Role.any())],
    writePermissions: user && [Permission.write(Role.user(user.$id))],
  });

  return {
    permissions,
    onCollectionTypeChange: (value: CollectionType) => {
      if (!user) return;
      const isCollectionTypePublic = value === CollectionType.PUBLIC;
      if (isCollectionTypePublic)
        setPermissions({
          readPermissions: [Permission.read(Role.any())],
          writePermissions: [Permission.write(Role.user(user.$id))],
        });
      else
        setPermissions({
          readPermissions: [Permission.read(Role.user(user.$id))],
          writePermissions: [Permission.write(Role.user(user.$id))],
        });
    },
  };
}
