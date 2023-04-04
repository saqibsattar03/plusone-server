import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LocationDto } from './location.dto';

export class SocialPostDto {
  @ApiProperty({ description: 'user Id' })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ description: 'voucher Id' })
  voucherId: string;

  @ApiProperty({ description: 'location' })
  location: LocationDto;

  @ApiProperty({ description: 'caption for the post' })
  caption: string;

  @ApiProperty({
    description: 'images/video address for the post',
    type: [String],
  })
  media: string[];

  @ApiProperty({
    description: 'Post visible to audience',
  })
  postAudiencePreference: string;

  @ApiProperty({ description: 'is it feed or review type post' })
  postType: string;
}

export class UpdateSocialPost {
  @ApiProperty()
  postId: string;
  @ApiProperty({ description: 'location' })
  location: LocationDto;

  @ApiProperty({ description: 'caption for the post' })
  caption: string;

  @ApiProperty({
    description: 'Post visible to audience',
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

  // @ApiProperty()
  // @IsNotEmpty()
  // postId: string;

  @ApiProperty()
  @IsNotEmpty()
  commentObject: {
    _id: any;
    userId: any;
    commentText: string;
    updatedAt: Date;
  };
}
