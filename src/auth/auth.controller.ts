import { Controller, Param, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() request: any): Promise<any> {
    return this.authService.login(request.body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Request() request: any): Promise<any> {
    return this.authService.profile(request.user.email);
  }

  @Post('forgot-password')
  forgotPassword(@Query('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Post('reset-password/:userId/:token')
  resetPassword(
    @Body('password') password,
    @Param('userId') userId,
    @Param('token') token,
  ) {
    return this.authService.resetPassword(userId, token, password);
  }

  // @Post('logout')
  // logout(@Request() request: any): Promise<any> {
  //   return this.authService.logout(request.user);
  // }
}
