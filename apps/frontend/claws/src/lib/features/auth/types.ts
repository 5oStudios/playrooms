export interface ThirdPartyInfo {
  id: string;
  userId: string;
}

export interface LoginMethod {
  recipeId: 'emailpassword' | 'thirdparty' | 'passwordless';
  tenantIds: string[];
  timeJoined: number;
  recipeUserId: string;
  verified?: boolean;
  email?: string;
  phoneNumber?: string;
  thirdParty?: ThirdPartyInfo;
}

export interface User {
  id: string;
  timeJoined: number;
  isPrimaryUser: boolean;
  tenantIds: string[];
  emails: string[];
  phoneNumbers: string[];
  thirdParty: ThirdPartyInfo[];
  loginMethods: LoginMethod[];
}
