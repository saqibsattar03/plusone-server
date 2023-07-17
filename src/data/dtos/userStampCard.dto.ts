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

  @ApiProperty({ type: String, name: 'status' })
  status: string;

  @ApiProperty({ type: Number, name: 'redeemedPoints' })
  @IsNotEmpty()
  redeemedPoints: number;

  @ApiProperty({ type: Date, name: 'startDate' })
  startDate: Date;
}

export class StampCardHistoryDto {
  @ApiProperty({ type: String, name: '_id' })
  _id: string;

  @ApiProperty({ type: String, name: 'cardId' })
  cardId: string;

  @ApiProperty({ type: String, name: 'userId' })
  userId: string;

  @ApiProperty({ type: String, name: 'restaurantId' })
  restaurantId: string;

  @ApiProperty({ type: Number, name: 'totalPoints' })
  totalPoints: number;

  @ApiProperty({ type: () => Date })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  updatedAt: Date;
}
