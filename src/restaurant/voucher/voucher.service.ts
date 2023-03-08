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
    console.log(data);
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
    const res = result[0].voucherObject._id;
    await this.voucherModel.updateOne({
      $pull: {
        voucherObject: {
          _id: oid,
        },
      },
    });
    console.log('res', res);
    return;
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
    console.log('outside if verified');
    if (isVerified) {
      const verificationCode = await this.fourDigitCode();
      console.log('inside if verified');
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
    if (restaurant.verificationCode == verificationCode) {
      const oid = new mongoose.Types.ObjectId(voucherId);
      const user = await this.profileModel.findOne({ _id: userId });
      const voucher = await this.voucherModel.findOne(
        {
          restaurantId: restaurantId,
        },
        { voucherObject: { $elemMatch: { _id: oid } } },
      );
      if (voucher.voucherObject[0].voucherType == user.accountHolderType) {
        const res = await this.redeemVoucherModel.findOne({
          userId: userId,
          voucherId: voucherId,
        });
        if (!res) {
          await this.redeemVoucherModel.create({
            userId: userId,
            voucherId: voucherId,
          });
          // this.rewardPoints++;
          // await this.reward(userId, this.rewardPoints, this.profileModel);
          // if (this.rewardPoints == 10) {
          //   throw new HttpException('you get a free voucher', HttpStatus.OK);
          // }
          await this.profileModel
            .findById({ _id: userId })
            .updateOne({ rewardPoints: this.rewardPoints });
          throw new HttpException(
            'voucher Redeemed Successfully',
            HttpStatus.OK,
          );
        }
        throw new HttpException('already redeemed', HttpStatus.NOT_ACCEPTABLE);
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
  }

  async reward(userId, points, profileModel): Promise<any> {
    console.log(userId);
    console.log(points);
    console.log(profileModel);
  }
  async getAllVoucherRedeemedByUser(userId): Promise<any> {
    console.log(userId);
    const oid = new mongoose.Types.ObjectId(userId);
    const allVouchers = await this.redeemVoucherModel
      .findOne({ userId: oid })
      .populate('userId');

    // const allVouchers = await this.redeemVoucherModel.aggregate([
    //   {
    //     $match: { userId: oid },
    //   },
    //   // { $unwind: '$voucherObject' },
    //   // { $match: { 'voucherObject._id': oid } },
    // ]);
    console.log(allVouchers);
    return allVouchers;
  }

  async fourDigitCode() {
    return 155 * 8 + Math.floor(Math.random() * 100);
  }
}
