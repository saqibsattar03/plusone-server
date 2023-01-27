/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateCommentDTO{

    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    postId: string;

    @ApiProperty()
    @IsNotEmpty()
    comment: string;    
}