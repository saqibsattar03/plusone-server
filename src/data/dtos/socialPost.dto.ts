import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LocationDto } from './location.dto';

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

  @ApiProperty({ type: String, name: 'mediaType' })
  mediaType: string;

  @ApiProperty({
    type: String,
    name: 'postAudiencePreference',
  })
  postAudiencePreference: string;

  @ApiProperty({ type: String, name: 'postType' })
  postType: string;
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
  // @ApiProperty()
  // @IsNotEmpty()
  // userId: string;

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
