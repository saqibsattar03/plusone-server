import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { jwtConstants } from './guards/constant';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from '../../data/schemas/forgotPassword.schema';

@Module({
  imports: [
    ProfilesModule,
    PassportModule,
    JwtModule.register({
      //save secret key in env file
      // secret: jwtConstants.secret,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '168 hours' },
    }),
    MongooseModule.forFeature([
      {
        name: ForgotPassword.name,
        schema: ForgotPasswordSchema,
      },
    ]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
