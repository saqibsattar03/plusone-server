import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LocationDto } from './location.dto';
import { VoucherDto } from './voucher.dto';

export class SocialPostDto {
  @ApiProperty({ type: String, name: 'userId' })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ type: String, name: 'voucherId' })
  voucherId: string;

  @ApiProperty({ type: LocationDto, name: 'location' })
  location: LocationDto;

  @ApiProperty({ type: String, name: 'caption' })
  caption: string;

  @ApiProperty({
    name: 'media',
    type: [String],
  })
  media: string[];

  @ApiProperty({
    type: String,
    name: 'postAudiencePreference',
  })
  postAudiencePreference: string;

  @ApiProperty({ type: String, name: 'postType' })
  postType: string;
}

export class GetSocialPostDto {
  postAudiencePreference: string;

  @ApiProperty({ type: String, required: false })
  userId: string;
}
export class SocialPostResponseDto {
  @ApiProperty({ type: String })
  _id: string;
  @ApiProperty({ type: String, name: 'userId' })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ type: String, name: 'voucherId' })
  voucherId: string;

  @ApiProperty({ type: LocationDto, name: 'location' })
  location: LocationDto;

  @ApiProperty({ type: String, name: 'caption' })
  caption: string;

  @ApiProperty({
    name: 'media',
    type: [String],
  })
  media: string[];

  @ApiProperty({
    type: String,
    name: 'postAudiencePreference',
  })
  postAudiencePreference: string;

  @ApiProperty({ type: String, name: 'postType' })
  postType: string;

  @ApiProperty({ type: Boolean })
  postLiked: boolean;

  @ApiProperty({ type: Boolean })
  userFollowed: boolean;

  @ApiProperty({ type: Number })
  likesCount: number;

  @ApiProperty({ type: Number })
  commentCount: number;

  username: string;
  profileImage: string;
  voucher: {
    restaurantId: string;
    title: string;
    voucherPreference: string;
    discount: number;
    description: string;
    voucherImage: string;
    estimatedSavings: string;
  };
}
export class UpdateSocialPost {
  @ApiProperty({ type: String, name: 'postId' })
  postId: string;
  @ApiProperty({ type: LocationDto, name: 'location' })
  location: LocationDto;

  @ApiProperty({ type: String, name: 'caption' })
  caption: string;

  @ApiProperty({
    type: String,
    name: 'postAudiencePreference',
  })
  postAudiencePreference: string;
}

export class PostLikedDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: object;

  @ApiProperty()
  @IsNotEmpty()
  postId: object;
}

export class CommentDto {
  @ApiProperty()
  @IsNotEmpty()
  postId: string;

  @ApiProperty()
  @IsNotEmpty()
  commentObject: {
    _id: any;
    userId: any;
    commentText: string;
    updatedAt: Date;
  };
}
