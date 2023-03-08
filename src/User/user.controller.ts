import { Controller, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { ApiBadRequestResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './profiles/dto/create-user.dto';

@ApiTags('Sign Up User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('signup')
  @ApiBody({
    type: CreateUserDto,
    description: 'Users Created as response',
  })
  @ApiBadRequestResponse({ description: 'can not create user' })
  async createUser(@Body() data) {
    console.log(data);
    const saltOrRounds = 10;
    data.password = await bcrypt.hash(data.password, saltOrRounds);
    return this.userService.createUser(data);
  }

  @Get('verify/:confirmationCode')
  verifyUser(@Param('confirmationCode') confirmationCode) {
    return this.userService.verifyUser(confirmationCode);
  }

  @Patch('change-password')
  changePassword(
    @Query('email') email,
    @Query('oldPassword') oldPassword,
    @Query('newPassword') newPassword,
  ) {
    return this.userService.changePassword(email, oldPassword, newPassword);
  }
}
