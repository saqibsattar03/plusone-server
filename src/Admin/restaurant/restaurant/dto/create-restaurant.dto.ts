import { LocationDto } from '../../../../User/profiles/dto/location.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: () => String })
  restaurantName: string;

  @ApiProperty({ type: String })
  profileImage: string;

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

  @ApiProperty({ type: Number })
  reviewCount: number;

  @ApiProperty({ type: Number })
  totalVoucherCreated: number;

  @ApiProperty({ type: () => Date })
  createdAt: Date;
  @ApiProperty({ type: () => Date })
  updatedAt: Date;
}
