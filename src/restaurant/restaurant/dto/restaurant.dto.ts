export class RestaurantDto {
  phoneNumber: number;
  menu: [string];
  description: string;
  voucherCount: number;
  // image:[]
  location: string;
  tags: [string];
  culinaryOptions: [string];
  dietaryRestrictions: [string];
  uniqueCode: number;
  isSponsored: boolean;
}
