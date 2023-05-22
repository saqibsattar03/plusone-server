import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FollowingDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  followings: any;
}

export class FollowResponse {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  surname: string;

  @ApiProperty({ type: String })
  profileImage: string;
}

export class FollowRequest {
  @ApiProperty()
  requestedFrom: {
    _id: string;
    firstname: string;
    surname: string;
  };

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
