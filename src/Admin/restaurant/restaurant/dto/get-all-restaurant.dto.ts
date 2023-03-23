import { ApiProperty } from '@nestjs/swagger';

export class GetAllRestaurantDto {
  @ApiProperty({ type: String })
  _id: string;
  @ApiProperty({ type: String })
  restaurantName: string;

  @ApiProperty({
    type: String,
  })
  profileImage: string;

  @ApiProperty({
    type: Number,
  })
  totalVouchers: number;
  @ApiProperty({
    type: Number,
  })
  totalReviews: number;
}
