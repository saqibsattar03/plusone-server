import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from '../../modules/profiles/profiles.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from '../../data/schemas/forgotPassword.schema';
import mongoose, { Model } from 'mongoose';
import { Constants } from '../constants';
import { comparePassword, hashPassword } from '../utils/passwordHashing.util';
import { Profile, ProfileDocument } from '../../data/schemas/profile.schema';
import { AwsMailUtil } from '../utils/aws-mail-util';
import { getRandomNumber } from '../utils/generateRandomNumber.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => ProfilesService))
    private profileService: ProfilesService,
    private jwtService: JwtService,
    @InjectModel(ForgotPassword.name)
    private readonly forgotModel: Model<ForgotPasswordDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createUser(userDto: any) {
    userDto.password = await hashPassword(userDto.password);
    const lowerCaseUserName = userDto.username.toLowerCase();
    const lowerCaseEmail = userDto.email.toLowerCase();
    if (userDto.role == Constants.ADMIN || userDto.role == Constants.MERCHANT)
      userDto.accountHolderType = null;

    const existingUser = await this.profileModel.findOne({
      $or: [
        { username: lowerCaseUserName },
        { email: lowerCaseEmail },
        { username: lowerCaseEmail },
      ],
    });
    if (existingUser) {
      if (existingUser.username === lowerCaseUserName)
        throw new HttpException(
          'A user with this Username already exists',
          HttpStatus.UNAUTHORIZED,
        );
      else
        throw new HttpException(
          'A user with this Email already exists',
          HttpStatus.UNAUTHORIZED,
        );
    }
    const confirmationCode = await getRandomNumber(1254, 3517);
    const newUser = new this.profileModel({
      firstname: userDto.firstname,
      surname: userDto.surname,
      username: lowerCaseUserName,
      email: lowerCaseEmail,
      password: userDto.password,
      accountHolderType: userDto.accountHolderType,
      role: userDto.role,
      scopes: userDto.scopes,
      status: userDto.status,
      rewardPoints: 0,
      confirmationCode: confirmationCode,
    });
    await newUser.save();
    if (newUser.role == Constants.MERCHANT) return newUser;

    //*** email verification ***//

    const templateData = {
      title:
        userDto.firstname.slice(0, 1).toUpperCase() +
        userDto.firstname.slice(1).toLowerCase(),
      code: confirmationCode,
    };
    await new AwsMailUtil().sendEmail(
      lowerCaseEmail,
      templateData,
      'AccountVerification',
    );

    throw new HttpException(
      'Account Created Successfully. Please Confirm Your Email to Active Your Account. Check Your Email for Confirmation',
      HttpStatus.OK,
    );
  }
  async verifyUser(data): Promise<any> {
    console.log(data);
    const oid = new mongoose.Types.ObjectId(data._id);
    const user = await this.profileModel
      .findById({ _id: oid })
      .select('confirmationCode');
    if (user.confirmationCode == data.confirmationCode) {
      await this.profileModel.findOneAndUpdate(
        { _id: oid },
        {
          $set: {
            status: Constants.ACTIVE,
            confirmationCode: null,
          },
        },
      );
      throw new HttpException('Account Activated Successfully', HttpStatus.OK);
    } else
      throw new HttpException(
        'token expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
  }
  async resendVerificationCode(email: string): Promise<any> {
    const confirmationCode = await getRandomNumber(1045, 8917);
    const user = await this.profileModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { confirmationCode: confirmationCode },
    );
    //*** email verification ***//

    const templateData = {
      title:
        user.firstname.slice(0, 1).toUpperCase() +
        user.firstname.slice(1).toLowerCase(),
      code: confirmationCode,
    };
    await new AwsMailUtil().sendEmail(
      user.email.toLowerCase(),
      templateData,
      'AccountVerification',
    );
  }
  async validateUser(email: string, enteredPassword: string): Promise<any> {
    const user = await this.profileService.getUser(email.toLowerCase());
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const fetchedUser = await this.profileService.getUser(
      user.email.toLowerCase(),
    );
    if (fetchedUser.accountHolderType != user.accountHolderType) {
      throw new HttpException(
        'user Account Type Does Not Match',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // if (
    //   fetchedUser.role != Constants.ADMIN &&
    //   fetchedUser.status != Constants.ACTIVE
    // ) {
    //   throw new UnauthorizedException('Account is in pending state');
    // }
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
        token: await getRandomNumber(4752, 7856),
      }).save();
    }
    // *** Send Email for to get code to reset password ***//

    const templateData = {
      title:
        user.firstname.slice(0, 1).toUpperCase() +
        user.firstname.slice(1).toLowerCase(),
      code: token.token,
    };
    await new AwsMailUtil().sendEmail(email, templateData, 'ForgotPassword');
    return token;
  }
  async verifyPasswordToken(data): Promise<any> {
    const user = await this.profileService.getUser(data.email.toLowerCase());
    if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);
    const res = await this.forgotModel.findOne({
      userId: user._id,
      token: data.token,
    });
    if (!res)
      throw new HttpException(
        'token expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
    else {
      // await res.delete();
      throw new HttpException('token verified', HttpStatus.OK);
    }
  }

  async resendPasswordToken(email: string): Promise<any> {
    const user = await this.profileService.getUser(email);
    if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);
    const token = await getRandomNumber(4752, 7856);
    await this.forgotModel.findOneAndUpdate(
      { userId: user._id },
      { token: token },
    );
    // *** Send Email for to get code to reset password ***//

    const templateData = {
      title:
        user.firstname.slice(0, 1).toUpperCase() +
        user.firstname.slice(1).toLowerCase(),
      code: token,
    };
    await new AwsMailUtil().sendEmail(email, templateData, 'ForgotPassword');
    return token;
  }
  async resetPassword(data) {
    const user = await this.profileService.getUser(data.email.toLowerCase());
    if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);
    await this.profileService.resetPassword(user, data.password);
    throw new HttpException('Password Reset Successfully ', HttpStatus.OK);
  }
  // async logout(user: any) {
  //   return await this.userService.logout(user.userId);
  // }
}
