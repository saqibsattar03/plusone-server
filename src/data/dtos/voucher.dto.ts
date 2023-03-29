import { ApiProperty } from '@nestjs/swagger';
export class VoucherDto {
  @ApiProperty({ type: String, example: '64082da2a264b35fa2a3e9cf' })
  restaurantId: any;

  @ApiProperty()
  voucherObject: {
    _id: any;
    title: string;
    discount: number;
    description: string;
    voucherPreference: string;
    voucherType: string;
    voucherImage: string;
    estimatedSavings: string;
    estimatedCost: number;
  };
}
class VoucherPreference {
  preference: string;
}

export class UpdateVoucherDto {
  @ApiProperty()
  voucherObject: {
    discount: number;
    description: string;
    voucherImage: string;
  };
}
