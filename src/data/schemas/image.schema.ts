import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ImageSchema {
  @Prop({ type: String })
  fileName: string;

  // @Prop({ type: String })
  // filePath: string;
}
