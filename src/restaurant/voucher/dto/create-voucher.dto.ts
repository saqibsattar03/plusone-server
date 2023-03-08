import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({ type: String, example: '64082da2a264b35fa2a3e9cf' })
  restaurantId: any;
  @ApiProperty()
  voucherObject: {
    _id: any;
    discount: number;
    description: string;
    voucherType: string;
    voucherCode: number;
    voucherImage: string;
  };
}
