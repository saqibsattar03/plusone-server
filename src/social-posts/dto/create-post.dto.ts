/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Prop } from "@nestjs/mongoose";


export class CreatePostDTO{

    @ApiProperty({description:'user Id', example:'63d2549476e862ed7649bfac'})
    @IsNotEmpty()
    userId: object;


    @ApiProperty({description: 'user location when posting', example:'sparko sol'})
    location: string;
    
    @ApiProperty({description:'caption for the post', example:'attitude boy'})
    caption: string;

    @ApiProperty({description:"images/video for the post"})
    media:[{
        fileName: string,
        filePath: string
      }];

    postAudiencePreference: string;


    
}