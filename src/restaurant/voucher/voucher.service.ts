import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from '../../Schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../Schemas/redeemVoucher.schema';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../../Schemas/restaurant.schema';

import * as moment from 'moment';

@Injectable()
export class VoucherService {
  studentVoucherCount = 0;
  nonStudentVoucherCount = 0;
  rewardPoints = 9;
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
    @InjectModel(RedeemVoucher.name)
    private readonly redeemVoucherModel: Model<RedeemVoucherDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async createStudentVoucher(voucherDto: CreateVoucherDto): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherDto.voucherObject._id);
    const res = await this.voucherModel.findOne({
      restaurantId: voucherDto.restaurantId,
    });
    if (!res) {
      const r = await this.voucherModel.create({
        restaurantId: voucherDto.restaurantId,
      });
      await r.updateOne({
        $push: {
          voucherObject: {
            _id: oid,
            voucherCode: voucherDto.voucherObject.voucherCode,
            voucherType: voucherDto.voucherObject.voucherType,
            discount: voucherDto.voucherObject.discount,
            description: voucherDto.voucherObject.description,
            voucherImage: voucherDto.voucherObject.voucherImage,
          },
        },
      });
      this.studentVoucherCount++;
    } else if (res) {
      const code = await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        {
          $match: {
            'voucherObject.voucherCode': voucherDto.voucherObject.voucherCode,
          },
        },
      ]);
      if (code.length)
        throw new HttpException(
          'voucher code already present',
          HttpStatus.NOT_ACCEPTABLE,
        );
      await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': 'student' } },
      ]);
      if (this.studentVoucherCount < 3) {
        this.studentVoucherCount++;
        await res.updateOne({
          $push: {
            voucherObject: {
              _id: oid,
              voucherCode: voucherDto.voucherObject.voucherCode,
              voucherType: voucherDto.voucherObject.voucherType,
              discount: voucherDto.voucherObject.discount,
              description: voucherDto.voucherObject.description,
              voucherImage: voucherDto.voucherObject.voucherImage,
            },
          },
        });
      } else
        throw new HttpException(
          'Not Allowed to create more than 3 vouchers for student',
          HttpStatus.UNAUTHORIZED,
        );
    }
    throw new HttpException('voucher created Successfully', HttpStatus.OK);
  }
  async createNonStudentVoucher(voucherDto: CreateVoucherDto): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherDto.voucherObject._id);
    const res = await this.voucherModel.findOne({
      restaurantId: voucherDto.restaurantId,
    });
    if (!res) {
      const r = await this.voucherModel.create({
        restaurantId: voucherDto.restaurantId,
      });

      await r.updateOne({
        $push: {
          voucherObject: {
            _id: oid,
            voucherCode: voucherDto.voucherObject.voucherCode,
            voucherType: voucherDto.voucherObject.voucherType,
            discount: voucherDto.voucherObject.discount,
            description: voucherDto.voucherObject.description,
            voucherImage: voucherDto.voucherObject.voucherImage,
          },
        },
      });
      this.nonStudentVoucherCount++;
    } else if (res) {
      const code = await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        {
          $match: {
            'voucherObject.voucherCode': voucherDto.voucherObject.voucherCode,
          },
        },
      ]);
      if (code.length)
        throw new HttpException(
          'voucher code already present',
          HttpStatus.NOT_ACCEPTABLE,
        );
      await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': 'non-student' } },
      ]);
      if (this.nonStudentVoucherCount < 3) {
        this.nonStudentVoucherCount++;
        await res.updateOne({
          $push: {
            voucherObject: {
              _id: oid,
              voucherCode: voucherDto.voucherObject.voucherCode,
              voucherType: voucherDto.voucherObject.voucherType,
              discount: voucherDto.voucherObject.discount,
              description: voucherDto.voucherObject.description,
              voucherImage: voucherDto.voucherObject.voucherImage,
            },
          },
        });
      } else
        throw new HttpException(
          'Not Allowed to create more than 3 vouchers for non-student',
          HttpStatus.UNAUTHORIZED,
        );
    }
    throw new HttpException('voucher created successfully', HttpStatus.OK);
  }
  async getAllVouchersByRestaurant(restaurantId, voucherType): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.voucherModel.aggregate([
      {
        $match: { restaurantId: oid },
      },
      { $unwind: '$voucherObject' },
      { $match: { 'voucherObject.voucherType': voucherType } },
    ]);
  }
  async editVoucher(voucherId, data): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.voucherModel.updateOne(
      { 'voucherObject._id': oid },
      {
        $set: {
          'voucherObject.$.discount': data.voucherObject.discount,
          'voucherObject.$.description': data.voucherObject.description,
          'voucherObject.$.voucherImage': data.voucherObject.voucherImage,
        },
      },
    );
  }

  async deleteSingleVoucher(voucherObjectId): Promise<VoucherDocument> {
    const oid = new mongoose.Types.ObjectId(voucherObjectId);
    const result = await this.voucherModel.aggregate([
      { $unwind: '$voucherObject' },
      { $match: { 'voucherObject._id': oid } },
      // { $count: 'student voucher count' },
    ]);
    if (result[0].voucherObject.voucherType == 'student') {
      this.studentVoucherCount--;
    } else {
      this.nonStudentVoucherCount--;
    }
    await this.voucherModel.updateOne({
      $pull: {
        voucherObject: {
          _id: oid,
        },
      },
    });
    throw new HttpException('voucher deleted successfully', HttpStatus.OK);
  }
  async deleteAllVoucher(voucherId) {
    this.studentVoucherCount = 0;
    this.nonStudentVoucherCount = 0;
    return this.voucherModel.findByIdAndDelete({ _id: voucherId });
  }

  async askForRestaurantCode(restaurantId): Promise<any> {
    return this.restaurantModel
      .findOne({ _id: restaurantId })
      .select('uniqueCode -_id');
  }

  async verifyRestaurantCode(restaurantId, restaurantCode): Promise<any> {
    let isVerified: boolean;
    const res = await this.restaurantModel
      .findOne({
        _id: restaurantId,
      })
      .select('uniqueCode -_id');
    // eslint-disable-next-line prefer-const
    isVerified = res.uniqueCode == restaurantCode;
    if (isVerified) {
      const verificationCode = await this.fourDigitCode();
      await this.restaurantModel.findOneAndUpdate(
        { _id: restaurantId },
        {
          verificationCode: verificationCode,
        },
      );
      return verificationCode;
    } else
      throw new HttpException(
        'Please Enter Correct Restaurant Code',
        HttpStatus.NOT_ACCEPTABLE,
      );
  }

  async redeemVoucher(
    userId,
    voucherId,
    restaurantId,
    verificationCode,
  ): Promise<any> {
    const restaurant = await this.restaurantModel.findOne({
      _id: restaurantId,
    });
    const user = await this.profileModel.findOne({ _id: userId });

    // checking if user already bought subscription //

    if (user.isPremium) {
      //checking if user at the right restaurant through restaurant's verification code //
      if (restaurant.verificationCode == verificationCode) {
        const oid = new mongoose.Types.ObjectId(voucherId);

        // fetching restaurant's voucher //

        const voucher = await this.voucherModel.findOne(
          {
            restaurantId: restaurantId,
          },
          { voucherObject: { $elemMatch: { _id: oid } } },
        );

        const voucherDetails = await this.redeemVoucherModel.findOne({
          userId: userId,
          voucherId: voucherId,
        });

        // checking if exactly 1 year past //
        if (voucherDetails) {
          const year = moment().diff(voucherDetails.updatedAt, 'year');
          if (year >= 1) {
            if (
              voucher.voucherObject[0].voucherType == user.accountHolderType
            ) {
              await this.redeemVoucherModel.findOneAndUpdate({
                userId: userId,
                voucherId: voucherId,
              });
              // await this.restaurantModel.findOneAndDelete(
              //   {
              //     restaurantId: restaurantId,
              //   },
              //   { verificationCode: verificationCode },
              // );
            }
            throw new HttpException(
              'Voucher Redeemed Again. Come Back Next Year!!',
              HttpStatus.ACCEPTED,
            );
          }
        }
        // checking if the voucher and customer type matches //
        if (voucher.voucherObject[0].voucherType == user.accountHolderType) {
          const res = await this.redeemVoucherModel.findOne({
            userId: userId,
            voucherId: voucherId,
          });

          // saving user details about voucher redemption in database if not already in database //

          if (!res) {
            await this.redeemVoucherModel.create({
              userId: userId,
              voucherId: voucherId,
              restaurantId: restaurantId, //*** storing restaurantId to get popular restaurants ***//
            });
            await this.restaurantModel.findOneAndUpdate(
              {
                restaurantId: restaurantId,
              },
              { $unset: { verificationCode: '' } },
            );
            // this.rewardPoints++;
            // await this.reward(userId, this.rewardPoints, this.profileModel);
            // if (this.rewardPoints == 10) {
            //   throw new HttpException('you get a free voucher', HttpStatus.OK);
            // }
            // await this.profileModel
            //   .findById({ _id: userId })
            //   .updateOne({ rewardPoints: this.rewardPoints });
            throw new HttpException(
              'voucher Redeemed Successfully',
              HttpStatus.OK,
            );
          }
          // if voucher already redeemed //
          else
            throw new HttpException(
              'already redeemed',
              HttpStatus.NOT_ACCEPTABLE,
            );
        } else
          throw new HttpException(
            'voucher type does not match',
            HttpStatus.NOT_ACCEPTABLE,
          );
      } else
        throw new HttpException(
          'verification code does not match',
          HttpStatus.FORBIDDEN,
        );
    } else
      throw new HttpException(
        'You must buy subscription to redeem the voucher',
        HttpStatus.FORBIDDEN,
      );
  }

  async reward(userId, points, profileModel): Promise<any> {
    console.log(userId);
    console.log(points);
    console.log(profileModel);
  }
  async getAllVoucherRedeemedByUser(userId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(userId);
    return this.redeemVoucherModel.aggregate([
      {
        $match: { userId: oid },
      },
      {
        $lookup: {
          from: 'vouchers',
          let: { voucherId: '$voucherId' },
          as: 'voucher',
          pipeline: [
            {
              $unwind: '$voucherObject',
            },
            {
              $match: {
                $expr: {
                  $eq: ['$voucherObject._id', '$$voucherId'],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'profiles',
          // let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', oid],
                },
              },
            },
          ],
          as: 'users',
        },
      },
      {
        $project: {
          'users._id': 1,
          'users.firstName': 1,
          'users.surName': 1,
          'users.profileImage': 1,
          'voucher.voucherObject.voucherCode': 1,
          'voucher.voucherObject.voucherType': 1,
          'voucher.voucherObject.description': 1,
          'voucher.voucherObject.discount': 1,
          'voucher.voucherObject.voucherImage': 1,
        },
      },
    ]);
  }

  async fourDigitCode() {
    return Math.floor(Math.random() * 7291 + 1000);
  }
}
