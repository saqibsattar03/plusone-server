import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../User/user.module';
import { jwtConstants } from './guards/constant';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from '../User/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ProfilesModule } from '../User/profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from '../Schemas/forgotPassword.schema';

@Module({
  imports: [
    UserModule,
    ProfilesModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '50000s' },
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
