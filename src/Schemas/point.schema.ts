import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PointSchema {
  location: {
    type: {
      type: string;
      enum: ['Point'];
      default: 'Point';
      required: true;
    };
    coordinates: {
      type: [number];
      required: true;
    };
  };
}
export const pointSchema = SchemaFactory.createForClass(PointSchema);
pointSchema.index({ coordinates: '2dsphere' });
