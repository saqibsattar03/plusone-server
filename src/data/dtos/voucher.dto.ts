import { ApiProperty } from '@nestjs/swagger';

export class VoucherDto {
  @ApiProperty({ type: String, example: '64082da2a264b35fa2a3e9cf' })
  restaurantId: any;
  @ApiProperty()
  voucherObject: {
    _id: any;
    discount: number;
    description: string;
    voucherPreference: VoucherPreference[];
    voucherType: string;
    voucherCode: number;
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
