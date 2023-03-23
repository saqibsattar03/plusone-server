import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../../data/schemas/Profile.schema';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../../data/dtos/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}
  async createUser(createUserDto: UserDto) {
    const userName = await this.profileModel.findOne({
      userName: createUserDto.userName,
    });
    if (userName)
      throw new HttpException(
        'Username already taken',
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
      accountHolderType: createUserDto.accountHolderType,
      confirmationCode: token,
    });
    await newUser.save();
    // sendConfirmationEmail(newUser.email, newUser.confirmationCode);
    throw new HttpException(
      'Account Created Successfully. Please Confirm Your Email to Active Your Account. Check Your Email for Confirmation',
      HttpStatus.OK,
    );
  }

  async verifyUser(confirmationCode: string): Promise<any> {
    const verified = await this.profileModel.findOne({
      confirmationCode: confirmationCode,
    });
    if (verified) {
      await verified.updateOne({ status: 'ACTIVE' });
      await verified.updateOne({ confirmationCode: null });
      throw new HttpException('Account Activated Successfully', HttpStatus.OK);
    } else
      throw new HttpException(
        'confirmation code expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
  }
  async getUser(email: string) {
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
    if (!user) throw new HttpException('use not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword)
      throw new HttpException(
        'Old Password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const differentPassword = await bcrypt.compare(oldPassword, hashedPassword);
    if (!differentPassword) {
      user.password = hashedPassword;
      return user.save();
    } else
      throw new HttpException(
        'old password and new password can not be same',
        HttpStatus.NOT_ACCEPTABLE,
      );
  }

  // async logout(id: string): Promise<any> {
  //   return this.userModel.findByIdAndUpdate(id, { token: undefined });
  // }
}
