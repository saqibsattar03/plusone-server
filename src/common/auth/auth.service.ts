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
import { Model } from 'mongoose';
import { generateToken } from '../utils/generateToken.util';
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
    if (userDto.role == Constants.ADMIN || userDto.role == Constants.MERCHANT)
      userDto.accountHolderType = null;
    const existingUser = await this.profileModel.findOne({
      $or: [{ username: userDto.username }, { email: userDto.email }],
    });
    if (existingUser) {
      if (existingUser.username === userDto.username)
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
      username: userDto.username,
      email: userDto.email,
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

    /*** email verification ***/

    const templateData = {
      title:
        userDto.firstname.slice(0, 1).toUpperCase() +
        userDto.firstname.slice(1).toLowerCase(),
      code: confirmationCode,
    };
    await new AwsMailUtil().sendEmail(
      'saqibsattar710@gmail.com',
      templateData,
      'AccountVerification',
    );

    throw new HttpException(
      'Account Created Successfully. Please Confirm Your Email to Active Your Account. Check Your Email for Confirmation',
      HttpStatus.OK,
    );
  }
  async validateUser(email: string, enteredPassword: string): Promise<any> {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    console.log('user = ', user);
    const fetchedUser = await this.profileService.getUser(user.email);
    console.log('f user = ', fetchedUser);
    if (fetchedUser.accountHolderType != user.accountHolderType) {
      console.log('fetched user = ', fetchedUser);
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
        token: await getRandomNumber(4752, 7856),
      }).save();
    }
    // *** send this link to email service ***//
    // const templateData = {
    //   title:
    //     user.firstname.slice(0, 1).toUpperCase() +
    //     user.firstname.slice(1).toLowerCase(),
    //   code:token
    // };
    // await new AwsMailUtil().sendEmail(email);
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
