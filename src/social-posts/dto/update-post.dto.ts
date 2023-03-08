import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../../User/profiles/dto/location.dto';

export class UpdatePostDTO {
  @ApiProperty({ description: 'location' })
  location: LocationDto;

  @ApiProperty({ description: 'caption for the post' })
  caption: string;

  @ApiProperty({
    description: 'Post visible to audience',
  })
  postAudiencePreference: string;
}
