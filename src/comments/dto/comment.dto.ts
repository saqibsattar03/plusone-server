/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateCommentDTO{

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    postId: string;

    @IsNotEmpty()
    comment: string;    
}