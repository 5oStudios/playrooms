import { DataProvider } from '@refinedev/core';
import {
  Appwrite,
  Databases,
  dataProvider,
  ID,
  Permission,
  Role,
} from '@refinedev/appwrite';

export const customDataProvider = (
  appwriteClient: Appwrite,
  options: { databaseId: string } = { databaseId: 'default' }
): Required<DataProvider> => {
  const { databaseId } = options;

  const database = new Databases(appwriteClient);

  const originalDataProvider: Required<DataProvider> = dataProvider(
    appwriteClient,
    {
      databaseId,
    }
  );

  return {
    ...originalDataProvider,
    create: async ({ resource, variables, meta }) => {
      const permissions = [
        // Permission.read(Role.any()),
        // Permission.write(Role.any()),
        ...(meta?.readPermissions ?? [Permission.read(Role.any())]),
        ...(meta?.writePermissions ?? [Permission.write(Role.any())]),
      ];

      const { $id, ...restData } = await database.createDocument(
        databaseId,
        resource,
        meta?.documentId ?? ID.unique(),
        variables as unknown as object,
        permissions
      );

      return {
        data: {
          id: $id,
          ...restData,
        },
      } as any;
    },
    getOne: async ({ resource, id }) => {
      const { $id, ...restData } = await database.getDocument(
        databaseId,
        resource,
        id.toString()
      );

      return {
        data: {
          id: $id,
          ...restData,
        },
      } as any;
    },
    update: async ({ resource, id, variables, meta }) => {
      const permissions = [
        // Permission.read(Role.any()),
        // Permission.write(Role.any()),
        ...(meta?.readPermissions ?? [Permission.read(Role.any())]),
        ...(meta?.writePermissions ?? [Permission.write(Role.any())]),
      ];
      const { $id, ...restData } = await database.updateDocument(
        databaseId,
        resource,
        id.toString(),
        variables as any,
        permissions
      );

      return {
        data: {
          id: $id,
          ...restData,
        },
      } as any;
    },
    createMany: async ({ resource, variables, meta }) => {
      const permissions = [
        // Permission.read(Role.any()),
        // Permission.write(Role.any()),
        ...(meta?.readPermissions ?? [Permission.read(Role.any())]),
        ...(meta?.writePermissions ?? [Permission.write(Role.any())]),
      ];
      const data = await Promise.all(
        variables.map((document) =>
          database.createDocument<any>(
            databaseId,
            resource,
            meta?.documentId ?? ID.unique(),
            document as unknown as any,
            permissions
          )
        )
      );

      return {
        data: data.map(({ $id, ...restData }) => ({
          id: $id,
          ...restData,
        })),
      } as any;
    },
    deleteOne: async ({ resource, id }) => {
      await database.deleteDocument(databaseId, resource, id.toString());

      return {
        data: { id },
      } as any;
    },
    deleteMany: async ({ resource, ids }) => {
      await Promise.all(
        ids.map((id) =>
          database.deleteDocument(databaseId, resource, id.toString())
        )
      );

      return {
        data: ids.map((id) => ({
          id,
        })),
      } as any;
    },
    getMany: async ({ resource, ids }) => {
      const data = await Promise.all(
        ids.map((id) =>
          database.getDocument<any>(databaseId, resource, id.toString())
        )
      );

      return {
        data: data.map(({ $id, ...restData }) => ({
          id: $id,
          ...restData,
        })),
      } as any;
    },
    updateMany: async ({ resource, ids, variables, meta }) => {
      const permissions = [
        // Permission.read(Role.any()),
        // Permission.write(Role.any()),
        ...(meta?.readPermissions ?? [Permission.read(Role.any())]),
        ...(meta?.writePermissions ?? [Permission.write(Role.any())]),
      ];
      const data = await Promise.all(
        ids.map((id) =>
          database.updateDocument<any>(
            databaseId,
            resource,
            id.toString(),
            variables as unknown as object,
            permissions
          )
        )
      );

      return {
        data: data.map(({ $id, ...restData }) => ({
          id: $id,
          ...restData,
        })),
      } as any;
    },
    getApiUrl: () => {
      throw Error(
        "'getApiUrl' method is not implemented on refine-appwrite data provider."
      );
    },
    custom: () => {
      throw Error(
        "'custom' method is not implemented on refine-appwrite data provider."
      );
    },
  };
};
