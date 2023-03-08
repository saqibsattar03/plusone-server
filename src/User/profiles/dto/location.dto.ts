import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ type: () => String, example: 'Point' })
  type: string;

  @ApiProperty({ type: () => [Number], example: [50, 20] })
  coordinates: number[];
}
