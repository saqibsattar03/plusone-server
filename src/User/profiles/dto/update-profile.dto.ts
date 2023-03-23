import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from './location.dto';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Bio', type: String })
  bio: { type: 'string' };
  // @ApiProperty({
  //   description: 'Account Holder Type',
  //   type: String,
  //   enum: ['STUDENT', 'NON-STUDENT'],
  //   default: 'NON-STUDENT',
  // })
  accountHolderType: string;
  @ApiProperty({
    description: 'Account Type',
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC',
  })
  accountType: string;

  @ApiProperty({
    description: 'Other Social media account links',
    type: [String],
  })
  links: [string];
  @ApiProperty({
    description: 'Favorite Restaurants',
    type: [String],
  })
  favoriteRestaurant: [string];
  @ApiProperty({
    description: 'Favorite Cuisines',
    type: [String],
  })
  favoriteCuisine: [string];

  @ApiProperty({
    description: 'Diet Requirements',
    type: [String],
  })
  dietRequirement: [string];

  @ApiProperty({ description: 'images/video for the post' })
  profileImage: string;

  // @ApiProperty({ description: 'location' })
  // location: LocationDto;
}
