import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Restaurant } from './restaurant.schema';
import { HydratedDocument } from 'mongoose';

export type paymentDetailDocument = HydratedDocument<PaymentDetail>;

@Schema()
export class PaymentDetail {
  @Prop({ type: Number, default: 0 })
  totalDeposit: number;

  @Prop({ type: Number, default: 0 })
  availableDeposit: number;

  @Prop({ type: Number, default: 0 })
  totalSales: number;

  @Prop({ type: Number, default: 0 })
  totalDeductions: number;

  @Prop({ type: Number, default: 0 })
  pendingPayments: number;
}
export const PaymentDetailSchema = SchemaFactory.createForClass(PaymentDetail);
