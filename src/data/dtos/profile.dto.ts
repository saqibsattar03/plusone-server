import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ description: 'Object Id' })
  _id: string;
  @ApiProperty({ description: 'First Name', example: 'abc' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Sur Name', example: 'xyz' })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ description: 'user Name', example: 'abc123' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'email', example: 'abc@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Bio',
    example: 'Happiness depends upon ourselves – Aristotle',
  })
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
    type: () => String,
    description: 'Link of Instagram account',
    example: 'www.instagram.com',
  })
  instagramLink: string;

  @ApiProperty({
    type: () => String,
    description: 'Link of tiktok account',
    example: 'www.tiktok.com',
  })
  tiktokLink: string;

  @ApiProperty({
    type: () => [String],
    description: 'Favorite Restaurant',
    example: '["monal"]',
  })
  favoriteRestaurants: string[];

  @ApiProperty({
    type: () => [String],
    description: 'Favorite Cuisine',
    example: '["Thai", "Chinese"]',
  })
  favoriteCuisines: [string];

  @ApiProperty({
    type: () => [String],
    description: 'Favorite Chef',
    example: '["abc", "xyz"]',
  })
  favoriteChefs: string[];

  @ApiProperty({
    type: () => [String],
    description: 'Preferred Food type',
    example: '["Halal"]',
  })
  dietRequirements: string[];

  @ApiProperty({ description: 'images/video for the post', type: String })
  profileImage: string;

  @ApiProperty({ type: Number, default: 0 })
  rewardPoints: number;

  @ApiProperty({ type: Boolean, default: false })
  isPremium: boolean;

  @ApiProperty({ type: [String] })
  scopes: [string];

  @ApiProperty({ type: Boolean, default: false })
  isSkip: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  role: string;

  @ApiProperty({ type: Number, default: 0 })
  followingCount: number;

  @ApiProperty({ type: Number, default: 0 })
  followerCount: number;

  @ApiProperty({ type: Number, default: 0 })
  socialPostCount: number;
}
export class UpdateProfileDto {
  @ApiProperty({ description: 'Bio', type: String })
  bio: { type: 'string' };
  @ApiProperty({
    description: 'Account Type',
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC',
  })
  accountType: string;

  @ApiProperty({
    description: 'Post Audience Preference Setting',
    type: String,
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'],
    default: 'PUBLIC',
  })
  postAudiencePreference: string;

  @ApiProperty({
    type: () => String,
    description: 'Link of Instagram account',
    example: 'www.instagram.com',
  })
  instagramLink: string;

  @ApiProperty({
    type: () => String,
    description: 'Link of tiktok account',
    example: 'www.tiktok.com',
  })
  tiktokLink: string;

  @ApiProperty({
    description: 'Favorite Restaurants',
    type: [String],
  })
  favoriteRestaurants: [string];
  @ApiProperty({
    description: 'Favorite Cuisines',
    type: [String],
  })
  favoriteCuisines: [string];

  @ApiProperty({
    description: 'Diet Requirements',
    type: [String],
  })
  dietRequirements: [string];

  @ApiProperty({ description: 'images/video for the post' })
  profileImage: string;

  @ApiProperty({ type: Boolean })
  isSkip: boolean;

  @ApiProperty({ type: [String] })
  scopes: [string];

  @ApiProperty({ type: String })
  fcmToken: string;
}

export class RestaurantFilter {
  @ApiProperty({ type: [String] })
  cuisine: [string];
  @ApiProperty({ type: [String] })
  tags: [string];

  @ApiProperty({ type: [String] })
  dietary: [string];

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Boolean })
  popular: boolean;
}
