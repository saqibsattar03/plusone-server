import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from '../../modules/profiles/profiles.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from '../../data/schemas/forgotPassword.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfilesService,
    private jwtService: JwtService,
    @InjectModel(ForgotPassword.name)
    private readonly forgotModel: Model<ForgotPasswordDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.profileService.getUser(email);
    // await this.profileService.getUserByEmailAndPassword(email, password);
    if (!user) {
      throw new NotAcceptableException(
        'An account with these credentials does not exist, Please create your account first.',
      );
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (user && passwordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const fetchedUser = await this.profileService.getUserByEmailOrUserName(
      user,
    );
    if (fetchedUser.accountHolderType != user.accountHolderType) {
      throw new HttpException(
        'user Account Type Does Not Match',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (fetchedUser.role != 'ADMIN' && fetchedUser.status != 'ACTIVE') {
      throw new UnauthorizedException('Account is in pending state');
    }
    return {
      access_token: await this.jwtService.signAsync({
        email: fetchedUser.email,
        role: fetchedUser.role,
        sub: fetchedUser._id,
      }),
    };
  }
  async profile(user: any) {
    return this.profileService.fetchProfileUsingToken(user);
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.profileService.getUser(email);
    if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);
    let token = await this.forgotModel.findOne({ userId: user._id });
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyz*-+/+!@#$%^&*}{)(|~ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
    // *** send this link to email service ***//

    // const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    return token;
  }

  async resetPassword(data) {
    // const user = await this.profileService.getSingleProfile(userId);
    const user = await this.profileService.getUser(data.email);
    if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);
    const res = await this.forgotModel.findOne({
      userId: user._id,
      token: data.token,
    });
    if (!res)
      throw new HttpException('Invalid token or expired', HttpStatus.NOT_FOUND);
    await this.profileService.resetPassword(user, data.password);
    await res.delete();
    throw new HttpException('Password Reset Successfully ', HttpStatus.OK);
  }
  // async logout(user: any) {
  //   return await this.userService.logout(user.userId);
  // }
}