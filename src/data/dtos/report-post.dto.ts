import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReportPostDto {
  @ApiProperty({ type: String, name: 'userId' })
  userId: string;

  @ApiProperty({ type: String, name: 'postId' })
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ type: String, name: 'reportReason', default: '' })
  reportReason: string;
}
