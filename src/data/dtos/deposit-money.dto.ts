import { ApiProperty } from '@nestjs/swagger';

export class DepositMoneyDto {
  @ApiProperty()
  depositObject: {
    _id: any;
    amount: number;
  };
}
