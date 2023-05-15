import { Controller, Query } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { Get, Post } from '@nestjs/common/decorators';
import { InvitationDto } from '../../data/dtos/invitation.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Invitation')
@Controller('invite')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @ApiQuery({ type: String, name: 'sharedBy' })
  @ApiQuery({ type: String, name: 'recipient' })
  sendInvite(@Query('sharedBy') sharedBy, @Query('recipient') recipient) {
    const invitationDto = new InvitationDto();
    invitationDto.sharedBy = sharedBy;
    invitationDto.recipient = recipient;
    return this.invitationService.sendInvite(invitationDto);
  }

  @Get()
  @ApiQuery({ type: String, name: 'sharedBy' })
  checkInviteLimit(@Query('sharedBy') sharedBy) {
    console.log('get route called');
    return this.invitationService.checkInviteLimit(sharedBy);
  }
}
