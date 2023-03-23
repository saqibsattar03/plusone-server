import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'email', example: 'abc@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password', example: '123456789' })
  @IsNotEmpty()
  password: string;
}
