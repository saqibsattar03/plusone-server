import { Controller, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('signup')
  async createUser(
    @Body('password') userPassword: string,
    @Body('email') email: string,
  ) {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(userPassword, saltOrRounds);
    const result = await this.userService.createUser(email, hashPassword);
    return {
      msg: 'User successfully registered',
    };
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
