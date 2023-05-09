import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InvitationDocument = HydratedDocument<Invitation>;
@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  sharedBy: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  recipient: Profile;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
