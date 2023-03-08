import { LocationDto } from '../../../User/profiles/dto/location.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'user Id',
    example: '63d2549476e862ed7649bfac',
    type: () => String,
  })
  restaurantId: string;
  @ApiProperty({ type: () => Number })
  phoneNumber: number;
  @ApiProperty({ type: () => [String] })
  menu: [string];
  @ApiProperty({ type: () => String })
  description: string;

  @ApiProperty({ type: () => Number })
  voucherCount: number;
  @ApiProperty({ description: 'location' })
  location: LocationDto;

  @ApiProperty({ type: () => [String] })
  tags: [string];
  @ApiProperty({
    description: 'images/video address for the post',
    type: () => [String],
  })
  media: string[];

  @ApiProperty({ type: () => Number })
  verificationCode: {
    type: number;
    default: null;
  };

  @ApiProperty({ type: () => [String] })
  culinaryOptions: [string];

  @ApiProperty({ type: () => [String] })
  dietaryRestrictions: [string];

  @ApiProperty({ type: () => Number })
  uniqueCode: number;

  @ApiProperty({ type: () => Boolean })
  isSponsored: boolean;
}
