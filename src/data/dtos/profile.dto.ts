import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ description: 'Object Id' })
  @IsNotEmpty()
  _id: string;
  @ApiProperty({ description: 'First Name', example: 'abc' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Sur Name', example: 'xyz' })
  @IsNotEmpty()
  surName: string;

  @ApiProperty({ description: 'user Name', example: 'abc123' })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ description: 'email', example: 'abc@gmail.com' })
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'Bio',
    example: 'Happiness depends upon ourselves – Aristotle',
  })
  @IsNotEmpty()
  bio: string;

  @ApiProperty({
    description: 'Account Type',
    example: 'PRIVATE',
    enum: ['PUBLIC', 'PRIVATE'],
  })
  @IsNotEmpty()
  accountType: {
    type: string;
    enum: ['PUBLIC', 'PRIVATE'];
    default: 'PUBLIC';
  };
  @ApiProperty({
    description: 'Post Audience Preference',
    example: 'PUBLIC',
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'],
  })
  @IsNotEmpty()
  postAudiencePreference: {
    type: string;
    default: 'ONLY-ME';
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'];
  };

  @ApiProperty({
    enum: ['STUDENT', 'NON-STUDENT'],
    description: 'Account Holder Type',
    example: 'STUDENT',
  })
  @IsNotEmpty()
  accountHolderType: {
    type: string;
    enum: ['STUDENT', 'NON-STUDENT'];
    default: 'NON-STUDENT';
  };

  @ApiProperty({
    type: () => [String],
    description: 'Links of other social media account',
    example: '["www.tiktok.com"]',
  })
  @IsNotEmpty()
  links: string[];

  @ApiProperty({
    type: () => [String],
    description: 'Favorite Restaurant',
    example: '["monal"]',
  })
  @IsNotEmpty()
  favoriteRestaurant: string[];

  @ApiProperty({
    type: () => [String],
    description: 'Favorite Cuisine',
    example: '["Thai", "Chinese"]',
  })
  @IsNotEmpty()
  favoriteCuisine: [string];

  @ApiProperty({
    type: () => [String],
    description: 'Favorite Chef',
    example: '["abc", "xyz"]',
  })
  @IsNotEmpty()
  favoriteChef: string[];

  @ApiProperty({
    type: () => [String],
    description: 'Preferred Food type',
    example: '["Halal"]',
  })
  @IsNotEmpty()
  dietRequirement: string[];

  @ApiProperty({ description: 'images/video for the post', type: String })
  profileImage: string;

  // @ApiProperty({
  //   description:
  //     'a field named type that specifies the GeoJSON object type for example "Point" and in coordinates property longitude and latitude should be given  ',
  // })
  // location: LocationDto;

  // @ApiProperty({ type: Boolean, default: false })
  // isPremium: boolean;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class UserDto {
  @ApiProperty({ description: 'First Name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Sur Name' })
  @IsNotEmpty()
  surName: string;

  @ApiProperty({ description: 'user Name' })
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
