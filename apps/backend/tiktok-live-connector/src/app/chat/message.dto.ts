import { ApiProperty } from '@nestjs/swagger';
import { ChatMessage, FollowInfo, UserDetails } from './interface/message';

export class UserDetailsDto implements UserDetails {
  @ApiProperty()
  bioDescription: string;
  @ApiProperty()
  createTime: string;
  @ApiProperty()
  profilePictureUrls: string[];

  constructor(data: UserDetails) {
    Object.assign(this, data);
  }
}

export class FollowInfoDto implements FollowInfo {
  @ApiProperty()
  followStatus: number;
  @ApiProperty()
  followerCount: number;
  @ApiProperty()
  followingCount: number;
  @ApiProperty()
  pushStatus: number;

  constructor(data: FollowInfo) {
    Object.assign(this, data);
  }
}

export class MessageDto implements ChatMessage {
  @ApiProperty()
  comment: string;
  @ApiProperty()
  createTime: string;
  @ApiProperty()
  emotes: any[];
  @ApiProperty()
  followInfo: FollowInfoDto;
  @ApiProperty()
  followRole: number;
  @ApiProperty()
  gifterLevel: number;
  @ApiProperty()
  isModerator: boolean;
  @ApiProperty()
  isNewGifter: boolean;
  @ApiProperty()
  isSubscriber: boolean;
  @ApiProperty()
  msgId: string;
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  profilePictureUrl: string;
  @ApiProperty()
  secUid: string;
  @ApiProperty()
  teamMemberLevel: number;
  @ApiProperty()
  topGifterRank: any;
  @ApiProperty()
  uniqueId: string;
  @ApiProperty()
  userBadges: any[];
  @ApiProperty()
  userDetails: UserDetailsDto;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  userSceneTypes: any[];

  constructor(data: ChatMessage) {
    Object.assign(this, data);
  }
}
