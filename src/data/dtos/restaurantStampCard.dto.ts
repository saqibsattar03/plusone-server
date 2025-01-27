import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RestaurantStampCardDto {
  @ApiProperty({ type: String, name: 'restaurantId' })
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ type: String, name: 'name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, name: 'totalPoints' })
  @IsNotEmpty()
  totalPoints: number;

  @ApiProperty({ type: String, name: 'type' })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: Number, name: 'timeDurationInDays' })
  @IsNotEmpty()
  timeDurationInDays: number;

  @ApiProperty({ type: String, name: 'reward' })
  @IsNotEmpty()
  reward: string;
}
