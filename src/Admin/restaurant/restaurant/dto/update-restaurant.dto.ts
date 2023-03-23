import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../../../../User/profiles/dto/location.dto';

export class UpdateRestaurantDto {
  @ApiProperty({ type: () => Number })
  phoneNumber: number;
  @ApiProperty({ type: () => [String] })
  menu: [string];
  @ApiProperty({ type: () => String })
  description: string;

  @ApiProperty({ description: 'location' })
  location: LocationDto;

  @ApiProperty({ type: () => [String] })
  tags: [string];
  @ApiProperty({
    description: 'images/video address for the post',
    type: () => [String],
  })
  media: [string];

  @ApiProperty({ type: () => [String] })
  culinaryOptions: [string];

  @ApiProperty({ type: () => [String] })
  dietaryRestrictions: [string];
}
