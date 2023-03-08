import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRestaurantReviewDto {
  @ApiProperty({ type: String, example: '64082da2a264b35fa2a3e9cf' })
  @IsNotEmpty()
  restaurantId: any;
  @ApiProperty()
  reviewObject: {
    _id: any;
    userId: any;
    reviewText: string;
    rating: number;
  };
}
