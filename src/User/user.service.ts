import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/user.schema';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../Schemas/Profile.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './profiles/dto/create-user.dto';
import * as http from 'http';

@Injectable()
export class UserService {
  constructor(
    // @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const userName = await this.profileModel.findOne({
      userName: createUserDto.userName,
    });
    if (userName)
      throw new HttpException(
        'User Name already taken',
        HttpStatus.UNAUTHORIZED,
      );
    const user = await this.profileModel.findOne({
      email: createUserDto.email,
    });
    if (user)
      throw new HttpException('Email already exist', HttpStatus.UNAUTHORIZED);
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const newUser = new this.profileModel({
      firstName: createUserDto.firstName,
      surName: createUserDto.surName,
      userName: createUserDto.userName,
      email: createUserDto.email,
      password: createUserDto.password,
      confirmationCode: token,
    });
    await newUser.save();
    // // sendConfirmationEmail(newUser.email, newUser.confirmationCode);
    return 'Account Created Successfully. Please confirm your email to Active your account. check your email for confirmation';
  }

  async verifyUser(confirmationCode: string): Promise<any> {
    const verified = await this.profileModel.findOne({
      confirmationCode: confirmationCode,
    });
    if (verified) {
      await verified.updateOne({ status: 'active' });
      await verified.updateOne({ confirmationCode: null });
      return 'Account Activated Successfully';
    } else return 'confirmation code does not match';
  }
  async getUser(email: string) {
    // return this.userModel.findOne({ email: email });
    return this.profileModel.findOne({
      $or: [{ email: email }, { userName: email }],
    });
  }

  async getUserById(userId) {
    return this.profileModel.findById({ _id: userId });
  }

  async resetPassword(user, password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await this.profileModel.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  }
  async changePassword(email: string, oldPassword, newPassword): Promise<any> {
    const user = await this.profileModel.findOne({ email: email });
    if (!user) {
      return 'user not found';
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return 'Old Password is incorrect';
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const differentPassword = await bcrypt.compare(oldPassword, hashedPassword);
    if (!differentPassword) {
      user.password = hashedPassword;
      return user.save();
    } else return 'old password and new password can not be same';
  }

  // async logout(id: string): Promise<any> {
  //   return this.userModel.findByIdAndUpdate(id, { token: undefined });
  // }
}
