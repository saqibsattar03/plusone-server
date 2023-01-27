/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PostLikedDTO{
    // userId: string

    @ApiProperty()
    @IsNotEmpty()
    postId: string
}