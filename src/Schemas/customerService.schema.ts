import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerServiceDocument = HydratedDocument<CustomerService>;
@Schema({ timestamps: true })
export class CustomerService {
  //*** ast = App Support Team ***//
  // @Prop({ type: String, default: 'abc@gmail.com' })
  // astEmail: string;
  // @Prop({ type: Number, default: 923082025173 })
  // astPhoneNumber: number;

  @Prop({ type: String })
  subject: string;

  @Prop({ type: String })
  customerQuery: string;
  @Prop({ type: String })
  file: string;
}
export const CustomerServiceSchema =
  SchemaFactory.createForClass(CustomerService);
