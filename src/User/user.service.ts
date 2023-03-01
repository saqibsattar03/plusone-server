import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/user.schema';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../Schemas/Profile.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}
  async createUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user) {
      return 'email already exist.Please Login instead';
    }
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const newUser = new this.userModel({
      email: email,
      password: password,
      confirmationCode: token,
    });
    await newUser.save();
    // sendConfirmationEmail(newUser.email, newUser.confirmationCode);
    return newUser;
  }

  async verifyUser(confirmationCode: string): Promise<any> {
    const verified = await this.userModel.findOne({
      confirmationCode: confirmationCode,
    });
    if (verified) {
      await verified.updateOne({ status: 'active' });
      return verified;
    } else return 'confirmation code does not match';
  }
  async getUser(email: string) {
    return this.userModel.findOne({ email: email });
  }

  async getUserById(userId) {
    return this.userModel.findById({ _id: userId });
  }

  async resetPassword(user, password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await this.userModel.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  }
  async changePassword(email: string, oldPassword, newPassword): Promise<any> {
    const user = await this.userModel.findOne({ email: email });
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
