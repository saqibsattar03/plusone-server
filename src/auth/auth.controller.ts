import { Controller, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateProfileDto } from '../User/profiles/dto/create-profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({
    description: 'SignIn successful',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Issue in request data' })
  @ApiUnauthorizedResponse({ description: 'email or password is incorrect' })
  @UseGuards(LocalAuthGuard)
  login(@Request() request: any): Promise<any> {
    return this.authService.login(request.body);
  }

  @Get('profile')
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({
    type: CreateProfileDto,
    description: 'Get Profile from access token',
  })
  @ApiBadRequestResponse({ description: 'token is not valid' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  profile(@Request() request: any): Promise<any> {
    return this.authService.profile(request.user.email);
  }

  @Post('forgot-password')
  @ApiQuery({ name: 'email', type: String })
  @ApiResponse({ description: 'Email sent successfully' })
  @ApiBadRequestResponse({
    description: 'could not find user email',
  })
  forgotPassword(@Query('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Post('reset-password')
  @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'token', type: String })
  @ApiResponse({ description: 'Password Reset Successfully' })
  @ApiBadRequestResponse({
    description: 'Could not reset password',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string' },
      },
    },
  })
  resetPassword(
    @Body('password') password,
    @Query('userId') userId,
    @Query('token') token,
  ) {
    return this.authService.resetPassword(userId, token, password);
  }

  // @Post('logout')
  // logout(@Request() request: any): Promise<any> {
  //   return this.authService.logout(request.user);
  // }
}
