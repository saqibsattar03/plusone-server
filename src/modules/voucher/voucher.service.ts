import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from '../../data/schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import { VoucherDto } from '../../data/dtos/voucher.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../data/schemas/redeemVoucher.schema';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ProfilesService } from '../profiles/profiles.service';
import { Constants } from '../../common/constants';
import { DepositMoneyService } from '../deposit-money/deposit-money.service';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
    @InjectModel(RedeemVoucher.name)
    private readonly redeemVoucherModel: Model<RedeemVoucherDocument>,
    private readonly restaurantService: RestaurantService,
    private readonly profileService: ProfilesService,
    private readonly depositMoneyService: DepositMoneyService,
  ) {}
  async getRestaurantTotalVoucherCount(
    restaurantId,
    voucherCount,
  ): Promise<any> {
    const r = await this.restaurantService.getRestaurantProfile(restaurantId);
    const sum = r.totalVoucherCount + voucherCount;
    await r.updateOne({ totalVoucherCount: sum });
  }
  async createStudentVoucher(voucherDto: VoucherDto): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherDto.voucherObject._id);
    const res = await this.voucherModel.findOne({
      restaurantId: voucherDto.restaurantId,
    });
    if (!res) {
      const r = await this.voucherModel.create({
        restaurantId: voucherDto.restaurantId,
      });
      await r.updateOne(this.createVoucherUpdateOperation(oid, voucherDto));
      const c = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('studentVoucherCount -_id');
      await this.voucherModel.findOneAndUpdate(
        { restaurantId: voucherDto.restaurantId },
        { studentVoucherCount: c.studentVoucherCount + 1 },
      );
      await this.getRestaurantTotalVoucherCount(voucherDto.restaurantId, 1);
    } else if (res) {
      let c;
      await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': Constants.STUDENT } },
      ]);
      // eslint-disable-next-line prefer-const
      c = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('studentVoucherCount -_id');
      if (c.studentVoucherCount < 3) {
        await res.updateOne(this.createVoucherUpdateOperation(oid, voucherDto));
        await this.voucherModel.findOneAndUpdate(
          { restaurantId: voucherDto.restaurantId },
          { studentVoucherCount: c.studentVoucherCount + 1 },
        );
        await this.getRestaurantTotalVoucherCount(voucherDto.restaurantId, 1);
      } else
        throw new HttpException(
          'Not Allowed to create more than 3 vouchers for student',
          HttpStatus.UNAUTHORIZED,
        );
    }
    throw new HttpException('voucher created Successfully', HttpStatus.OK);
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
      await r.updateOne(this.createVoucherUpdateOperation(oid, voucherDto));
      const c = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('nonStudentVoucherCount -_id');
      await this.voucherModel.findOneAndUpdate(
        { restaurantId: voucherDto.restaurantId },
        { nonStudentVoucherCount: c.nonStudentVoucherCount + 1 },
      );
      await this.getRestaurantTotalVoucherCount(voucherDto.restaurantId, 1);
    } else if (res) {
      let c;
      await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': Constants.NONSTUDENT } },
      ]);
      // eslint-disable-next-line prefer-const
      c = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('nonStudentVoucherCount -_id');
      if (c.nonStudentVoucherCount < 3) {
        await res.updateOne(this.createVoucherUpdateOperation(oid, voucherDto));
        await this.voucherModel.findOneAndUpdate(
          { restaurantId: voucherDto.restaurantId },
          { nonStudentVoucherCount: c.nonStudentVoucherCount + 1 },
        );
        await this.getRestaurantTotalVoucherCount(voucherDto.restaurantId, 1);
      } else
        throw new HttpException(
          'Not Allowed to create more than 3 vouchers for non student',
          HttpStatus.UNAUTHORIZED,
        );
    }
    throw new HttpException('voucher created Successfully', HttpStatus.OK);
  }
  async createVoucherForBoth(voucherDto: VoucherDto): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherDto.voucherObject._id);
    // let voucherCode = Math.floor(Math.random() * 5596 + 1249);
    let sCount;
    const res = await this.voucherModel.findOne({
      restaurantId: voucherDto.restaurantId,
    });
    if (!res) {
      const r = await this.voucherModel.create({
        restaurantId: voucherDto.restaurantId,
      });
      await r.updateOne(this.createVoucherUpdateOperation(oid, voucherDto));
      sCount = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('studentVoucherCount nonStudentVoucherCount -_id');
      await this.voucherModel.findOneAndUpdate(
        { restaurantId: voucherDto.restaurantId },
        {
          studentVoucherCount: sCount.studentVoucherCount + 1,
          nonStudentVoucherCount: sCount.nonStudentVoucherCount + 1,
        },
      );
      await this.getRestaurantTotalVoucherCount(voucherDto.restaurantId, 2);
    } else if (res) {
      await this.voucherModel.aggregate([
        { $unwind: '$voucherObject' },
        { $match: { 'voucherObject.voucherType': Constants.NONSTUDENT } },
      ]);
      // eslint-disable-next-line prefer-const
      sCount = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('studentVoucherCount nonStudentVoucherCount -_id');
      if (sCount.studentVoucherCount < 3 && sCount.nonStudentVoucherCount < 3) {
        await res.updateOne(this.createVoucherUpdateOperation(oid, voucherDto));
        await this.voucherModel.findOneAndUpdate(
          { restaurantId: voucherDto.restaurantId },
          {
            nonStudentVoucherCount: sCount.nonStudentVoucherCount + 1,
            studentVoucherCount: sCount.studentVoucherCount + 1,
          },
        );
        await this.getRestaurantTotalVoucherCount(voucherDto.restaurantId, 2);
      } else
        throw new HttpException(
          'one of your voucher type has reached the limit',
          HttpStatus.UNAUTHORIZED,
        );
    }
    throw new HttpException('voucher created Successfully', HttpStatus.OK);
  }
  async getSingleVoucher(voucherId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.voucherModel.aggregate([
      {
        $unwind: '$voucherObject',
      },
      {
        $match: {
          'voucherObject._id': oid,
        },
      },
    ]);
  }
  async getAllVouchersByRestaurant(restaurantId): Promise<any> {
    return this.voucherModel.findOne({ restaurantId: restaurantId });
  }
  async editVoucher(voucherId, data): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.voucherModel.findOneAndUpdate(
      { 'voucherObject._id': oid },
      {
        $set: {
          'voucherObject.$.discount': data.voucherObject.discount,
          'voucherObject.$.description': data.voucherObject.description,
          'voucherObject.$.estimatedSavings':
            data.voucherObject.estimatedSavings,
          'voucherObject.$.estimatedCost': data.voucherObject.estimatedCost,
          'voucherObject.$.voucherImage': data.voucherObject.voucherImage,
        },
      },
      { new: true },
    );
  }
  async disableVoucherForSpecificDays(data): Promise<any> {
    const dates = [];
    for (let i = 0; i < data.voucherDisableDates.length; i++) {
      const formattedDate = new Date(data.voucherDisableDates[i]);
      dates.push(formattedDate);
    }
    const oid = new mongoose.Types.ObjectId(data.voucherId);
    try {
      await this.voucherModel.findOneAndUpdate(
        { 'voucherObject._id': oid },
        {
          $set: {
            'voucherObject.$.voucherDisableDates': dates,
          },
        },
        { new: true },
      );
      return 'voucher disabled';
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  async verifyRestaurantCode(data): Promise<any> {
    const res = await this.restaurantService.getRestaurantVerificationCode(
      data.restaurantId,
      data.restaurantCode,
    );
    if (res) {
      if (res.uniqueCode == data.restaurantCode) {
        const verificationCode = await this.fourDigitCode(4);
        const res = await this.redeemVoucherModel.create({
          userId: data.userId,
          voucherId: data.voucherId,
          restaurantId: data.restaurantId,
          verificationCode: verificationCode,
        });
        const oid = new mongoose.Types.ObjectId(data.voucherId);
        const rPoints =
          await this.profileService.getUserRewardPointsOrEstimatedSavings(
            data.userId,
          );
        const voucher = await this.voucherModel.aggregate([
          {
            $unwind: '$voucherObject',
          },
          {
            $match: {
              'voucherObject._id': oid,
            },
          },
        ]);
        await this.restaurantService.addTotalSalesAndDeductions(
          voucher[0].voucherObject.estimatedCost,
          data.restaurantId,
        );
        await this.profileService.updateProfile(
          data,
          rPoints.estimatedSavings +
            parseInt(voucher[0].voucherObject.estimatedSavings),
          rPoints.rewardPoints + 1,
        );
        const availableBalance =
          await this.restaurantService.getAvailableRestaurantBalance(
            data.restaurantId,
          );
        if (availableBalance < 50) {
          // todo: send email to recharge //
        }
        return res.verificationCode;
      } else
        throw new HttpException(
          'Please Enter Correct Restaurant Code',
          HttpStatus.NOT_ACCEPTABLE,
        );
    } else
      throw new HttpException(
        'Please Enter Correct Restaurant Code',
        HttpStatus.NOT_ACCEPTABLE,
      );
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
          'voucher.voucherObject.voucherPreference': 1,
          'voucher.voucherObject.description': 1,
          'voucher.voucherObject.discount': 1,
          'voucher.voucherObject.voucherImage': 1,
        },
      },
    ]);
  }
  async getTotalVoucherRedeemedCount(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.redeemVoucherModel.aggregate([
      // {
      //   $match: {
      //     restaurantId: oid,
      //   },
      // },
      {
        $count: 'total count',
      },
    ]);
  }
  async getUserWhoRedeemVoucher(voucherId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.redeemVoucherModel.find({ voucherId: oid });
  }
  createVoucherUpdateOperation(oid, voucherDto) {
    return {
      $push: {
        voucherObject: {
          _id: oid,
          title: voucherDto.voucherObject.title,
          voucherType: voucherDto.voucherObject.voucherType,
          voucherPreference: voucherDto.voucherObject.voucherPreference,
          discount: voucherDto.voucherObject.discount,
          description: voucherDto.voucherObject.description,
          voucherImage: voucherDto.voucherObject.voucherImage,
          estimatedSavings: voucherDto.voucherObject.estimatedSavings,
          estimatedCost: voucherDto.voucherObject.estimatedCost,
          voucherDisableDates: [],
        },
      },
    };
  }
  // async getAllRedeemedVouchers(restaurantId): Promise<any> {
  //   const oid = new mongoose.Types.ObjectId(restaurantId);
  //   if (restaurantId) {
  //     return this.redeemVoucherModel.aggregate([
  //       {
  //         $match: {
  //           restaurantId: oid,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'vouchers',
  //           localField: 'restaurantId',
  //           foreignField: 'restaurantId',
  //           as: 'voucher',
  //         },
  //       },
  //       {
  //         $unwind: '$voucher',
  //       },
  //       {
  //         $project: {
  //           vouc: '$voucher.voucherObject',
  //         },
  //       },
  //       {
  //         $unwind: '$vouc',
  //       },
  //       {
  //         $lookup: {
  //           from: 'redeemvouchers',
  //           localField: 'vouc._id',
  //           foreignField: 'voucherId',
  //           as: 'voucher',
  //         },
  //       },
  //       {
  //         $unwind: '$voucher',
  //       },
  //       {
  //         $project: {
  //           // _id: 1,
  //           vouc: 1,
  //         },
  //       },
  //     ]);
  //   } else
  //     return this.redeemVoucherModel.aggregate([
  //       {
  //         $lookup: {
  //           from: 'vouchers',
  //           localField: 'restaurantId',
  //           foreignField: 'restaurantId',
  //           as: 'voucher',
  //         },
  //       },
  //       {
  //         $unwind: '$voucher',
  //       },
  //       {
  //         $project: {
  //           vouc: '$voucher.voucherObject',
  //         },
  //       },
  //       {
  //         $unwind: '$vouc',
  //       },
  //       {
  //         $lookup: {
  //           from: 'redeemvouchers',
  //           localField: 'vouc._id',
  //           foreignField: 'voucherId',
  //           as: 'v',
  //         },
  //       },
  //       {
  //         $unwind: '$v',
  //       },
  //       // {
  //       //   count: { $sum:  },
  //       // },
  //       //
  //       {
  //         $project: {
  //           // _id: 1,
  //           v: 1,
  //         },
  //       },
  //     ]);
  // }
  async getAllRedeemedVouchers(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    if (restaurantId) {
      return this.redeemVoucherModel.aggregate([
        {
          $match: {
            restaurantId: oid,
          },
        },
        {
          $lookup: {
            from: 'vouchers',
            localField: 'restaurantId',
            foreignField: 'restaurantId',
            as: 'voucher',
          },
        },
        {
          $unwind: '$voucher',
        },
        {
          $project: {
            vouc: '$voucher.voucherObject',
          },
        },
        {
          $unwind: '$vouc',
        },
        {
          $lookup: {
            from: 'redeemvouchers',
            localField: 'vouc._id',
            foreignField: 'voucherId',
            as: 'voucher',
          },
        },
        {
          $unwind: '$voucher',
        },
        {
          $project: {
            // _id: 1,
            vouc: 1,
          },
        },
      ]);
    } else
      return this.redeemVoucherModel.aggregate([
        {
          $lookup: {
            from: 'vouchers',
            localField: 'restaurantId',
            foreignField: 'restaurantId',
            as: 'voucher',
          },
        },
        {
          $unwind: '$voucher',
        },
        {
          $project: {
            vouc: '$voucher.voucherObject',
          },
        },
        {
          $unwind: '$vouc',
        },
        {
          $lookup: {
            from: 'redeemvouchers',
            localField: 'vouc._id',
            foreignField: 'voucherId',
            as: 'voucher',
          },
        },
        {
          $unwind: '$voucher',
        },
        {
          $project: {
            // _id: 1,
            vouc: 1,
          },
        },
      ]);
  }
  async fourDigitCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
