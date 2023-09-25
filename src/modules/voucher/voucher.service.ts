import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from '../../data/schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import { VoucherDto } from '../../data/dtos/voucher.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../data/schemas/redeem-voucher.schema';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ProfilesService } from '../profiles/profiles.service';
import { Constants } from '../../common/constants';
import { uniqueCodeUtil } from '../../common/utils/uniqueCode.util';
import { FcmService } from '../fcm/fcm.service';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';
import {
  FreeVoucherRedeemed,
  FreeVoucherDocument,
} from '../../data/schemas/free-voucher-redeemed.schema';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
    @InjectModel(RedeemVoucher.name)
    private readonly redeemVoucherModel: Model<RedeemVoucherDocument>,
    @InjectModel(FreeVoucherRedeemed.name)
    private readonly freeVoucherModel: Model<FreeVoucherDocument>,

    private readonly restaurantService: RestaurantService,
    private readonly profileService: ProfilesService,
    private readonly fcmService: FcmService,
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}
  async getRestaurantTotalVoucherCount(
    restaurantId,
    voucherCount,
  ): Promise<any> {
    const res = await this.restaurantService.getRestaurantProfile(restaurantId);
    const sum = res.totalVoucherCount + voucherCount;
    await res.updateOne({ totalVoucherCount: sum });
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
    return this.voucherModel.findOne(
      { 'voucherObject._id': oid },
      {
        restaurantId: 1,
        voucherObject: {
          $elemMatch: { _id: new mongoose.Types.ObjectId(oid) },
        },
      },
    );
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
    // checking if user is redeeming free voucher
    if (data.isFreeVoucher) {
      const response = await this.freeVoucherModel.findOne({
        userId: data.userId,
        restaurantId: data.restaurantId,
      });
      if (response)
        throw new HttpException(
          'You can not redeem more than 1 free voucher at same restaurant',
          HttpStatus.BAD_REQUEST,
        );
      else {
        return this.redeemVoucher(data);
      }
    }
    // checking user is premium and redeeming premium vouchers
    else {
      return this.redeemVoucher(data);
    }
  }
  async getAllVoucherRedeemedByUser(userId) {
    const oid = new mongoose.Types.ObjectId(userId);
    return this.redeemVoucherModel.aggregate([
      {
        $match: {
          userId: oid,
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      {
        $lookup: {
          from: 'vouchers',
          let: { voucherId: '$voucherId' },
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
          as: 'voucher',
        },
      },
      {
        $addFields: {
          restaurant: { $first: '$restaurant' },
        },
      },
      {
        $project: {
          verificationCode: 1,
          voucher: 1,
          restaurantName: '$restaurant.restaurantName',
          profileImage: '$restaurant.profileImage',
        },
      },
      {
        $unset: [
          '_id',
          'voucher.studentVoucherCount',
          'voucher.nonStudentVoucherCount',
          'voucher.restaurantId',
        ],
      },
      // {
      //   $unwind: '$voucher', // Unwind the voucher array
      // },
      // {
      //   $sort: {
      //     'voucher.createdAt': -1, // Sort based on the createdAt field within the voucher object
      //   },
      // },
    ]);
  }
  async getTotalVoucherRedeemedCount(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.redeemVoucherModel.find({ restaurantId: oid }).count();
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
          // createdAt: new Date(),
        },
      },
    };
  }
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
        // {
        //   $unwind: '$voucher',
        // },
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
        // {
        //   $unwind: '$vouc',
        // },
        {
          $lookup: {
            from: 'redeemvouchers',
            localField: 'vouc._id',
            foreignField: 'voucherId',
            as: 'voucher',
          },
        },
        // {
        //   $unwind: '$voucher',
        // },
        {
          $project: {
            // _id: 1,

            // getting 1st element present in vouc array and projecting it as an object
            vouc: { $arrayElemAt: ['$vouc', 0] },
          },
        },
      ]);
  }
  async userSavingsStats(userId, parameter): Promise<any> {
    const oid = new mongoose.Types.ObjectId(userId);
    let value = null;
    const { WEEK, MONTH, YEAR } = Constants;
    if (parameter == WEEK) value = 7;
    else if (parameter == MONTH) value = 30;
    else if (parameter == YEAR) value = 365;
    const pipeline = [];
    pipeline.push({
      $match: { userId: oid },
    });
    console.log('pipline = ', pipeline);
    if (value) {
      pipeline.push({
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - value)),
          },
        },
      });
    }
    pipeline.push(
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
        $unwind: '$voucher',
      },
      {
        $project: {
          userId: 1,
          restaurantId: 1,
          voucher: 1,
          createdAt: 1,
        },
      },
    );
    if (parameter == WEEK) {
      pipeline.push(
        {
          $group: {
            _id: { $dayOfWeek: '$createdAt' },

            sum: {
              $sum: { $toDouble: '$voucher.voucherObject.estimatedSavings' },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      );
    } else if (parameter == MONTH) {
      pipeline.push(
        {
          $group: {
            _id: { $dayOfMonth: '$createdAt' },
            sum: {
              $sum: { $toDouble: '$voucher.voucherObject.estimatedSavings' },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      );
    } else if (parameter == YEAR) {
      pipeline.push(
        {
          $group: {
            _id: { $month: '$createdAt' },
            sum: {
              $sum: { $toDouble: '$voucher.voucherObject.estimatedSavings' },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      );
    } else {
      // all savings

      pipeline.push(
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%m-%d', // or "%Y%m%d" for a numeric format
                date: '$createdAt',
              },
            },
            sum: {
              $sum: { $toDouble: '$voucher.voucherObject.estimatedSavings' },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      );
    }
    return this.redeemVoucherModel.aggregate(pipeline);
  }

  async sendRewardNotification(rPoints) {
    const notification = {
      email: rPoints.email,
      title: "🎉 Congratulations! You've Earned a Free Voucher! 🎁",
      body: '🎁 Surprise! Enjoy your reward and happy redeeming! 🎉🎁✨',
    };
    await this.fcmService.sendSingleNotification(notification);
  }

  async freeVoucherRedeemed(data, rPoints) {
    await this.freeVoucherModel.create({
      restaurantId: data.restaurantId,
      userId: data.userId,
    });
    await this.profileService.updateProfile(
      data,
      null,
      null,
      rPoints.freeVoucherCount - 1,
    );
    return;
  }

  async redeemVoucher(data) {
    const count = 0;
    const res = await this.restaurantService.getRestaurantVerificationCode(
      data.restaurantId,
      data.restaurantCode,
    );
    if (res) {
      if (res.uniqueCode == data.restaurantCode) {
        const verificationCode = await uniqueCodeUtil(4);
        const res = await this.redeemVoucherModel.create({
          userId: data.userId,
          voucherId: data.voucherId,
          restaurantId: data.restaurantId,
          verificationCode: verificationCode,
        });
        const oid = new mongoose.Types.ObjectId(data.voucherId);
        const rPoints = await this.profileService.getUserFields(data.userId);
        const voucher = await this.voucherModel.findOne(
          { 'voucherObject._id': oid },
          {
            voucherObject: {
              $elemMatch: { _id: oid },
            },
          },
        );

        // getting restaurant stats
        const restaurantStats =
          await this.restaurantService.addTotalSalesAndDeductions(
            voucher.voucherObject[0].estimatedCost,
            data.restaurantId,
          );

        // update user data
        const user = await this.profileService.updateProfile(
          data,
          rPoints.estimatedSavings +
            parseInt(voucher.voucherObject[0].estimatedSavings),
          rPoints.rewardPoints + 1,
          rPoints.freeVoucherCount + count,
        );

        // calculating and awarding free voucher on reward points count 10
        if (user.rewardPoints >= 10) {
          const remainder = user.rewardPoints % 10;
          const count = Math.floor(user.rewardPoints / 10);
          const newEstimatedSavings =
            rPoints.estimatedSavings +
            parseInt(voucher.voucherObject[0].estimatedSavings);
          const newFreeVoucherCount =
            rPoints.freeVoucherCount + count + (remainder === 0 ? 0 : 1);

          await this.profileService.updateProfile(
            data,
            newEstimatedSavings,
            remainder,
            newFreeVoucherCount,
          );
          await this.sendRewardNotification(rPoints);
        }

        // calculating data to create transaction history
        const transactionData = {
          restaurantId: data.restaurantId,
          transactionType: Constants.DEBIT,
          voucherType: voucher.voucherObject[0].voucherType,
          amount: voucher.voucherObject[0].estimatedCost,
          deductedAmount: voucher.voucherObject[0].estimatedCost * 0.1,
          availableDeposit: restaurantStats.availableDeposit,
        };
        await this.transactionHistoryService.createTransactionHistory(
          transactionData,
        );

        // restaurant low balance check //

        // if (restaurantStats.availableDeposit < 50) {
        //   const restaurantEmail = await this.profileService.getUserFields(
        //     restaurantStats.userId,
        //   );
        //
        //   //*** send email for low balance ***//
        //   const templateData = {
        //     title: 'Low Balance Alert!',
        //     merchant: restaurantStats.restaurantName,
        //     description:
        //       'Low balance, urgently need to deposit funds to cover expenses.',
        //     amount_title: 'Current Balance',
        //     amount: restaurantStats.availableDeposit,
        //   };
        //   // todo: send email to recharge //
        //   // await new AwsMailUtil().sendEmailWithAttachment();
        //   await new AwsMailUtil().sendEmail(
        //     restaurantEmail.email,
        //     templateData,
        //     'RestaurantBalance',
        //   );
        // }

        //*** sending voucher redemption notification to user ***//

        // const notification = {
        //   email: rPoints.email,
        //   title: 'Score! Your Voucher Has Been Redeemed 🎉🛍️💰',
        //   body: '🎁 Surprise! Voucher redeemed, and the savings are all yours to enjoy 🎉🛍️💰',
        // };
        // await this.fcmService.sendSingleNotification(notification);

        if (data.isFreeVoucher) {
          //todo:: add logic here
          await this.freeVoucherRedeemed(data, rPoints);
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
}
