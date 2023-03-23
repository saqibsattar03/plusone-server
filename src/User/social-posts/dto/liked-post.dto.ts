import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostLikedDTO {
  @ApiProperty()
  @IsNotEmpty()
  userId: object;

  @ApiProperty()
  @IsNotEmpty()
  postId: object;
}
