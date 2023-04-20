import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class LocationSchema {
  @Prop({ default: 'Point' })
  type: string;

  @Prop({ type: [Number] })
  coordinates: [number];
}
