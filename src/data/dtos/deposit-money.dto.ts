import { ApiProperty } from '@nestjs/swagger';

export class DepositMoneyDto {
  depositObject: {
    _id: any;
    amount: number;
  };
}
