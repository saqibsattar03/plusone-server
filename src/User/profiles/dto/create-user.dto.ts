import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class CreateUserDto {
  @ApiProperty({ description: 'First Name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Sur Name' })
  @IsNotEmpty()
  surName: string;

  @ApiProperty({ description: 'User Name' })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ description: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  accountHolderType: string;
}
