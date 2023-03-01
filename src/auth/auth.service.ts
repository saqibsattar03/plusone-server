import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserService } from '../User/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from '../User/profiles/profiles.service';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from '../Schemas/forgotPassword.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../Schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private profileService: ProfilesService,
    private jwtService: JwtService,
    @InjectModel(ForgotPassword.name)
    private readonly forgotModel: Model<ForgotPasswordDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUser(email);
    if (!user) {
      throw new NotAcceptableException('could not find user');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (user && passwordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // if (user.status != "active") {
    //   return "Pending Account. Please Verify Your Email!"
    // }
    return {
      access_token: await this.jwtService.signAsync({
        email: user.email,
        sub: user._id,
      }),
    };
  }
  async profile(user: any) {
    return {
      profile: await this.profileService.fetchProfileUsingToken(user),
    };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userService.getUser(email);
    if (!user) return 'no such user found';
    let token = await this.forgotModel.findOne({ userId: user._id });
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let generateToken = '';
    for (let i = 0; i < 25; i++) {
      generateToken +=
        characters[Math.floor(Math.random() * characters.length)];
    }
    if (!token) {
      token = await new this.forgotModel({
        userId: user._id,
        token: generateToken,
      }).save();
    }
    // const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    return user;
  }

  async resetPassword(userId, token, password) {
    const user = await this.userService.getUserById(userId);
    console.log(user._id);
    if (!user) return 'invalid link or expired';
    const res = await this.forgotModel.findOne({
      userId: user._id,
      token: token,
    });
    if (!res) return 'invalid link or expired';
    await this.userService.resetPassword(user, password);
    await res.delete();
    return 'password updated successfully';
  }
  // async logout(user: any) {
  //   return await this.userService.logout(user.userId);
  // }
}
