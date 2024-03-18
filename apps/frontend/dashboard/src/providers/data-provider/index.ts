'use client';
import {
  Account,
  Appwrite,
  liveProvider as appwriteLiveProvider,
  Storage,
} from '@refinedev/appwrite';
import {
  APPWRITE_PROJECT,
  APPWRITE_TOKEN_KEY,
  APPWRITE_URL,
} from '@utility/constants';
import Cookies from 'js-cookie';
import { customDataProvider } from '@dataProvider';

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);

// for client side authentication
const appwriteJWT = Cookies.get(APPWRITE_TOKEN_KEY);
if (appwriteJWT) {
  appwriteClient.setJWT(appwriteJWT);
}

const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { appwriteClient, account, storage };

export const dataProvider = customDataProvider(appwriteClient, {
  databaseId: '65f866dd5fb44d97c7fd',
});

export const liveProvider = appwriteLiveProvider(appwriteClient, {
  databaseId: 'database',
});
