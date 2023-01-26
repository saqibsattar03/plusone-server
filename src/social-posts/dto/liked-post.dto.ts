/* eslint-disable prettier/prettier */

import { IsNotEmpty } from "class-validator";

export class PostLikedDTO{
    // userId: string

    @IsNotEmpty()
    postId: string
}