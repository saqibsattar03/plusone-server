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
import { generateToken } from '../utils/generateToken';
import { Constants } from '../constants';
import { comparePassword } from '../utils/passwordHashing';

@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfilesService,
    private jwtService: JwtService,
    @InjectModel(ForgotPassword.name)
    private readonly forgotModel: Model<ForgotPasswordDocument>,
  ) {}

  async validateUser(email: string, enteredPassword: string): Promise<any> {
    console.log('validate user = ', email);
    const user = await this.profileService.getUser(email);
    // await this.profileService.getUserByEmailAndPassword(email, password);
    if (!user) {
      throw new NotAcceptableException(
        'An account with these credentials does not exist, Please create your account first.',
      );
    }
    const isValidPassword = await comparePassword(
      enteredPassword,
      user.password,
    );
    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log(user);
    const fetchedUser = await this.profileService.getUser(user.email);
    console.log('fetcheduser = ', fetchedUser);
    if (fetchedUser.accountHolderType != user.accountHolderType) {
      throw new HttpException(
        'user Account Type Does Not Match',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (
      fetchedUser.role != Constants.ADMIN &&
      fetchedUser.status != Constants.ACTIVE
    ) {
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
    // return this.profileService.getUser(user);
    return this.profileService.fetchProfileUsingToken(user);
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.profileService.getUser(email);
    if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);
    let token = await this.forgotModel.findOne({ userId: user._id });
    if (!token) {
      token = await new this.forgotModel({
        userId: user._id,
        token: await generateToken(),
      }).save();
    }
    // *** send this link to email service ***//

    // const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    return token;
  }

  async resetPassword(data) {
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
