import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FollowingDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  followings: any;
}
