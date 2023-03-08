import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({ description: 'id of review object is needed' })
  _id: string;
  @ApiProperty()
  reviewText: string;
  @ApiProperty()
  rating: number;
}
