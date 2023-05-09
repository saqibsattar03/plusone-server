import { ApiProperty } from '@nestjs/swagger';

export class InvitationDto {
  @ApiProperty({ type: String, name: 'sharedBy' })
  sharedBy: string;

  @ApiProperty({ type: String, name: 'recipient' })
  recipient: string;
}
