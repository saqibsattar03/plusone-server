import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuoteDocument = HydratedDocument<Quotes>;
@Schema({ timestamps: true })
export class Quotes {
  @Prop()
  quoteText: string;
}

export const QuotesSchema = SchemaFactory.createForClass(Quotes);
