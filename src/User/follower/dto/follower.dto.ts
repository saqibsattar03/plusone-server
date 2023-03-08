import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FollowerDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  followers: any;
}
