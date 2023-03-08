import { ApiProperty } from '@nestjs/swagger';

export class UpdateVoucherDto {
  @ApiProperty()
  voucherObject: {
    discount: number;
    description: string;
    voucherImage: string;
  };
}
