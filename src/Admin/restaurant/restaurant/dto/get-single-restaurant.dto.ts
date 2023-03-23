import { ApiProperty } from '@nestjs/swagger';

export class GetSingleRestaurantDto {
  @ApiProperty({ type: String })
  restaurantName: string;
  @ApiProperty({ type: String })
  profileImage: string;

  @ApiProperty({
    type: Object,
    example: {
      _id: '641aa419547b0700bac512e9',
      restaurantId: '641aa412547b0700bac512df',
      reviewObject: [
        {
          _id: '641aa419547b0700bac512e7',
          userId: '64082e63a264b35fa2a3e9d3',
          reviewText: 'this is lol review text',
          rating: 2,
        },
      ],
    },
  })
  reviews: object;
  @ApiProperty({
    type: Array,
    example: [
      {
        _id: '641aa973e4b94834a5f3e6ae',
        voucherCode: '6017',
        voucherPreference: 'NON-STUDENT',
        voucherType: 'NON-STUDENT',
        discount: 10,
        description: '10% discount Voucher',
        voucherImage: '05a610ae5b2f0e5111c46544e7850793',
        estimatedSavings: '20%',
        estimatedCost: 100,
      },
    ],
  })
  vouchers: [object];
  @ApiProperty({ type: [String] })
  media: string[];

  @ApiProperty({
    type: [Object],
    example: [
      {
        _id: '641abb0494db69e13473326f',
        userId: '6417e82eff140df62a3ab00b',
        restaurantId: '641aa412547b0700bac512df',
        voucherId: '641aa973e4b94834a5f3e6ae',
        createdAt: '2023-03-22T08:23:32.369Z',
        updatedAt: '2023-03-22T08:23:32.369Z',
        __v: 0,
      },
    ],
  })
  redeemedVouchers: [object];
}
