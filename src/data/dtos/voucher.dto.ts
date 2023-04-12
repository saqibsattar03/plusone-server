import { ApiProperty } from '@nestjs/swagger';
export class VoucherDto {
  @ApiProperty({ type: String })
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
    // voucherDisable: [VoucherDisableDates];
  };
}
class VoucherPreference {
  preference: string;
}
class VoucherDisableDates {
  dates: Date;
}

export class UpdateVoucherDto {
  @ApiProperty()
  voucherObject: {
    discount: number;
    description: string;
    voucherImage: string;
    estimatedSavings: string;
    estimatedCost: number;
  };
}
