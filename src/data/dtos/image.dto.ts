import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImageDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  fileName: string;
}
