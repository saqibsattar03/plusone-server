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
import { ProfileDto } from '../../data/dtos/profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
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
    console.log('here at login route');
    return this.authService.login(request.body);
  }

  @Get('person')
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({
    type: ProfileDto,
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
  // @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiResponse({ description: 'Password Reset Successfully' })
  @ApiBadRequestResponse({
    description: 'Could not reset password',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        token: { type: 'string' },
      },
    },
  })
  resetPassword(@Body() data) {
    return this.authService.resetPassword(data);
  }

  // @Post('logout')
  // logout(@Request() request: any): Promise<any> {
  //   return this.authService.logout(request.user);
  // }
}
