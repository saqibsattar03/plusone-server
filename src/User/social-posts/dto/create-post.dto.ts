import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LocationDto } from '../../profiles/dto/location.dto';

export class CreatePostDTO {
  @ApiProperty({ description: 'user Id', example: '63d2549476e862ed7649bfac' })
  @IsNotEmpty()
  userId: string;

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
}
