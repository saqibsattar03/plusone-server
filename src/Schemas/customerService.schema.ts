import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ImageSchema } from './image.schema';

export type CustomerServiceDocument = HydratedDocument<CustomerService>;
@Schema({ timestamps: true })
export class CustomerService {
  //*** ast = App Support Team ***//
  @Prop({ type: String, default: 'abc@gmail.com' })
  astEmail: string;
  @Prop({ type: Number, default: 923082025173 })
  astPhoneNumber: number;
  @Prop()
  customerQuery: string;
  @Prop({ type: String })
  image: string;
}
export const CustomerServiceSchema =
  SchemaFactory.createForClass(CustomerService);
