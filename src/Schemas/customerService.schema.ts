import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CustomerServiceDocument = HydratedDocument<CustomerService>;
@Schema({ timestamps: true })
export class CustomerService {
  //*** ast = App Support Team ***//
  @Prop()
  astEmail: string;
  @Prop()
  astPhoneNumber: number;
  @Prop()
  customerQuery: string;
}
export const CustomerServiceSchema =
  SchemaFactory.createForClass(CustomerService);
