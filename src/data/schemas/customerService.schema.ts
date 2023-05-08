import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';

export type CustomerServiceDocument = HydratedDocument<CustomerService>;
@Schema({ timestamps: true })
export class CustomerService {
  //*** ast = App Support Team ***//
  // @Prop({ type: String, default: 'abc@gmail.com' })
  // astEmail: string;
  // @Prop({ type: Number, default: 923082025173 })
  // astPhoneNumber: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Profile.name,
    index: true,
  })
  userId: Profile;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String })
  file: string;
}
export const CustomerServiceSchema =
  SchemaFactory.createForClass(CustomerService);
