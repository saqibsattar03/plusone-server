import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from '../../Schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import { VoucherDto } from './dto/voucher.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../Schemas/redeemVoucher.schema';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';

@Injectable()
export class VoucherService {
  studentVoucherCount = 0;
  nonStudentVoucherCount = 0;
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
    @InjectModel(RedeemVoucher.name)
    private readonly redeemVoucherModel: Model<RedeemVoucherDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createStudentVoucher(voucherDto: VoucherDto): Promise<any> {
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
          },
        },
      });
      this.studentVoucherCount++;
    } else if (res) {
      const result = await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': 'student' } },
      ]);
      // for(let i =0;i< result.length;i++){
      //   if(result[i].voucherObject.voucherType == 'student')this.studentVoucherCount++
      // }
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
            },
          },
        });
      } else {
        return 'you can not create more than 3 vouchers for students or type might be wrong ';
      }
    }
  }
  async createNonStudentVoucher(voucherDto: VoucherDto): Promise<any> {
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
          },
        },
      });
      this.nonStudentVoucherCount++;
    } else if (res) {
      const result = await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': 'non-student' } },
      ]);
      // for(let i =0;i< result.length;i++){
      //   if(result[i].voucherObject.voucherType == 'non-student')this.nonStudentVoucherCount++
      // }
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
            },
          },
        });
      } else {
        return 'you can not create more than 3 vouchers for non students or type might be wrong ';
      }
    }
  }
  async getAllVouchesByRestaurant(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    const allVouchers = await this.voucherModel
      .find({ restaurantId: oid })
      .exec();
    console.log('res = ', allVouchers);
    return allVouchers;
  }
  async editVoucher(voucherId, data): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    const voucher = await this.voucherModel.updateOne(
      { 'voucherObject._id': oid },
      {
        $set: {
          'voucherObject.$.discount': data.discount,
          'voucherObject.$.description': data.description,
          'voucherObject.$.voucherType': data.voucherType,
          'voucherObject.$.voucherCode': data.voucherCode,
        },
      },
    );
    return voucher;
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

  async redeemVoucher(userId, voucherId, restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    const user = await this.profileModel.findOne({ _id: userId });
    const voucher = await this.voucherModel.findOne(
      {
        restaurantId: restaurantId,
      },
      { voucherObject: { $elemMatch: { _id: oid } } },
    );
    console.log('voucher = ', voucher.voucherObject[0].voucherType);
    console.log('user = ', user.accountHolderType);
    if (voucher.voucherObject[0].voucherType == user.accountHolderType) {
      const res = await this.redeemVoucherModel.findOne({
        userId: userId,
        voucherId: voucherId,
      });
      if (!res) {
        return this.redeemVoucherModel.create({
          userId: userId,
          voucherId: voucherId,
        });
      } else return 'already redeemed';
    } else return 'voucher type does not match';
  }
  async getAllVoucherRedeemedByUser(userId): Promise<any> {
    return this.redeemVoucherModel.find({ userId: userId });
  }
}
