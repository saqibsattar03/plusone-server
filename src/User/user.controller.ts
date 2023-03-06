import { Controller, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('signup')
  async createUser(@Body() data) {
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
