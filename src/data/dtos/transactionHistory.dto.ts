import { ApiProperty } from '@nestjs/swagger';

export class TransactionHistoryDto {
  @ApiProperty({ type: String })
  restaurantId: string;

  @ApiProperty({ type: String })
  voucherType: string;

  @ApiProperty({ type: String })
  transactionType: string;

  @ApiProperty({ type: Number })
  amount: number;

  @ApiProperty({ type: Number })
  deductedAmount: number;

  @ApiProperty({ type: Number })
  voucherSalePrice: number;

  @ApiProperty({ type: Number })
  availableDeposit: number;
}
