import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDTO {
  // @ApiProperty()
  // @IsNotEmpty()
  // userId: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // postId: string;

  @ApiProperty()
  @IsNotEmpty()
  commentObject: {
    _id: any;
    userId: any;
    commentText: string;
  };
}
