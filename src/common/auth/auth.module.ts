import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { jwtConstants } from './guards/secret';
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
import { Profile, ProfileSchema } from '../../data/schemas/profile.schema';
import * as process from 'process';

@Module({
  imports: [
    forwardRef(() => ProfilesModule),
    PassportModule,
    JwtModule.register({
      //save secret key in env file
      // secret: process.env.SECRET_KEY,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
    MongooseModule.forFeature([
      {
        name: ForgotPassword.name,
        schema: ForgotPasswordSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
