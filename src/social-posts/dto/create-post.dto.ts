/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreatePostDTO{

    @ApiProperty({description:'user Id', example:'63d2549476e862ed7649bfac'})
    @IsNotEmpty()
    username: string;


    @ApiProperty({description: 'user location when posting', example:'sparko sol'})
    location: string;
    
    @ApiProperty({description:'caption for the post', example:'attitude boy'})
    caption: string;
    
    @ApiProperty({description:"comments object", example:'papa ki pari'})
    comments: {object};
    

    @ApiProperty({description:"images/video for the post"})
    media:[{
        fileName: string,
        filePath: string
      }];


      @ApiProperty({description:"user id who liked the specific post ",example:'63d2549476e862ed7649bfac'})
      like:[]

    
}