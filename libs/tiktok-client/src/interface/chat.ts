export interface TikTokChatMessage {
  emotes: any[];
  comment: string;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: any[];
  userSceneTypes: any[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: any;
  gifterLevel: number;
  teamMemberLevel: number;
  msgId: string;
  createTime: string;
}

export interface UserDetails {
  createTime: string;
  bioDescription: string;
  profilePictureUrls: string[];
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}
