import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserStampCardDto {
  @ApiProperty({ type: String, name: 'restaurantId' })
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ type: String, name: 'userId' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: String, name: 'cardId' })
  @IsNotEmpty()
  cardId: string;

  @ApiProperty({ type: Number, name: 'redeemedPoints' })
  @IsNotEmpty()
  redeemedPoints: number;

  @ApiProperty({ type: Date, name: 'startDate' })
  @IsNotEmpty()
  startDate: Date;
}
