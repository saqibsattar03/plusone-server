import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from '../../data/schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import { VoucherDto } from '../../data/dtos/voucher.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../data/schemas/redeemVoucher.schema';

import * as moment from 'moment';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ProfilesService } from '../profiles/profiles.service';
import { Constants } from '../../common/constants';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
    @InjectModel(RedeemVoucher.name)
    private readonly redeemVoucherModel: Model<RedeemVoucherDocument>,
    private readonly restaurantService: RestaurantService,
    private readonly profileService: ProfilesService,
  ) {}
  studentVoucherCount = 0;
  nonStudentVoucherCount = 0;
  rewardPoints = 0;
  totalVoucherCreated = 0;

  async createStudentVoucher(voucherDto: VoucherDto): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherDto.voucherObject._id);
    // let voucherCode = Math.floor(Math.random() * 5596 + 1249);
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
            title: voucherDto.voucherObject.title,
            voucherType: voucherDto.voucherObject.voucherType,
            // voucherCode: voucherCode,
            voucherPreference: voucherDto.voucherObject.voucherPreference,
            discount: voucherDto.voucherObject.discount,
            description: voucherDto.voucherObject.description,
            voucherImage: voucherDto.voucherObject.voucherImage,
            estimatedSavings: voucherDto.voucherObject.estimatedSavings,
            estimatedCost: voucherDto.voucherObject.estimatedCost,
          },
        },
      });
      const c = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('studentVoucherCount -_id');
      await this.voucherModel.findOneAndUpdate(
        { restaurantId: voucherDto.restaurantId },
        { studentVoucherCount: c.studentVoucherCount + 1 },
      );
    } else if (res) {
      let c;
      // const code = await this.voucherModel.aggregate([
      //   { $unwind: '$voucherObject' },
      //   {
      //     $match: {
      //       'voucherObject.voucherCode': voucherDto.voucherObject.voucherCode,
      //     },
      //   },
      // ]);
      // if (code.length) voucherCode = Math.floor(Math.random() * 5596 + 1249);

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
        await res.updateOne({
          $push: {
            voucherObject: {
              _id: oid,
              title: voucherDto.voucherObject.title,
              voucherType: voucherDto.voucherObject.voucherType,
              // voucherCode: voucherCode,
              voucherPreference: voucherDto.voucherObject.voucherPreference,
              discount: voucherDto.voucherObject.discount,
              description: voucherDto.voucherObject.description,
              voucherImage: voucherDto.voucherObject.voucherImage,
              estimatedSavings: voucherDto.voucherObject.estimatedSavings,
              estimatedCost: voucherDto.voucherObject.estimatedCost,
            },
          },
        });
        await this.voucherModel.findOneAndUpdate(
          { restaurantId: voucherDto.restaurantId },
          { studentVoucherCount: c.studentVoucherCount + 1 },
        );
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
    // let voucherCode = Math.floor(Math.random() * 5596 + 1249);
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
            title: voucherDto.voucherObject.title,
            voucherType: voucherDto.voucherObject.voucherType,
            // voucherCode: voucherCode,
            voucherPreference: voucherDto.voucherObject.voucherPreference,
            discount: voucherDto.voucherObject.discount,
            description: voucherDto.voucherObject.description,
            voucherImage: voucherDto.voucherObject.voucherImage,
            estimatedSavings: voucherDto.voucherObject.estimatedSavings,
            estimatedCost: voucherDto.voucherObject.estimatedCost,
          },
        },
      });
      const c = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('nonStudentVoucherCount -_id');
      await this.voucherModel.findOneAndUpdate(
        { restaurantId: voucherDto.restaurantId },
        { nonStudentVoucherCount: c.nonStudentVoucherCount + 1 },
      );
    } else if (res) {
      let c;
      // const code = await this.voucherModel.aggregate([
      //   { $unwind: '$voucherObject' },
      //   {
      //     $match: {
      //       'voucherObject.voucherCode': voucherDto.voucherObject.voucherCode,
      //     },
      //   },
      // ]);
      // if (code.length) voucherCode = Math.floor(Math.random() * 5596 + 1249);

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
      console.log(c);
      if (c.nonStudentVoucherCount < 3) {
        await res.updateOne({
          $push: {
            voucherObject: {
              _id: oid,
              title: voucherDto.voucherObject.title,
              voucherType: voucherDto.voucherObject.voucherType,
              // voucherCode: voucherCode,
              voucherPreference: voucherDto.voucherObject.voucherPreference,
              discount: voucherDto.voucherObject.discount,
              description: voucherDto.voucherObject.description,
              voucherImage: voucherDto.voucherObject.voucherImage,
              estimatedSavings: voucherDto.voucherObject.estimatedSavings,
              estimatedCost: voucherDto.voucherObject.estimatedCost,
            },
          },
        });
        await this.voucherModel.findOneAndUpdate(
          { restaurantId: voucherDto.restaurantId },
          { nonStudentVoucherCount: c.nonStudentVoucherCount + 1 },
        );
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
      await r.updateOne({
        $push: {
          voucherObject: {
            _id: oid,
            title: voucherDto.voucherObject.title,
            voucherType: voucherDto.voucherObject.voucherType,
            // voucherCode: voucherCode,
            voucherPreference: voucherDto.voucherObject.voucherPreference,
            discount: voucherDto.voucherObject.discount,
            description: voucherDto.voucherObject.description,
            voucherImage: voucherDto.voucherObject.voucherImage,
            estimatedSavings: voucherDto.voucherObject.estimatedSavings,
            estimatedCost: voucherDto.voucherObject.estimatedCost,
          },
        },
      });
      sCount = await this.voucherModel
        .findOne({
          restaurantId: voucherDto.restaurantId,
        })
        .select('studentVoucherCount nonStudentVoucherCount -_id');
      console.log(sCount);
      await this.voucherModel.findOneAndUpdate(
        { restaurantId: voucherDto.restaurantId },
        {
          studentVoucherCount: sCount.studentVoucherCount + 1,
          nonStudentVoucherCount: sCount.nonStudentVoucherCount + 1,
        },
      );
    } else if (res) {
      // const code = await this.voucherModel.aggregate([
      //   { $unwind: '$voucherObject' },
      //   {
      //     $match: {
      //       'voucherObject.voucherCode': voucherDto.voucherObject.voucherCode,
      //     },
      //   },
      // ]);
      // if (code.length) voucherCode = Math.floor(Math.random() * 5596 + 1249);

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
        await res.updateOne({
          $push: {
            voucherObject: {
              _id: oid,
              title: voucherDto.voucherObject.title,
              voucherType: voucherDto.voucherObject.voucherType,
              // voucherCode: voucherCode,
              voucherPreference: voucherDto.voucherObject.voucherPreference,
              discount: voucherDto.voucherObject.discount,
              description: voucherDto.voucherObject.description,
              voucherImage: voucherDto.voucherObject.voucherImage,
              estimatedSavings: voucherDto.voucherObject.estimatedSavings,
              estimatedCost: voucherDto.voucherObject.estimatedCost,
            },
          },
        });
        await this.voucherModel.findOneAndUpdate(
          { restaurantId: voucherDto.restaurantId },
          {
            nonStudentVoucherCount: sCount.nonStudentVoucherCount + 1,
            studentVoucherCount: sCount.studentVoucherCount + 1,
          },
        );
      } else
        throw new HttpException(
          'one of your voucher type has reached the limit',
          HttpStatus.UNAUTHORIZED,
        );
    }
    throw new HttpException('voucher created Successfully', HttpStatus.OK);
  }

  async getAllVouchersByRestaurant(restaurantId): Promise<any> {
    return this.voucherModel.findOne({ restaurantId: restaurantId });
  }
  async editVoucher(voucherId, data): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    const res = await this.voucherModel.findOneAndUpdate(
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
      { returnDocument: 'after' },
    );
    return res;
  }

  //delete voucher route To be defined yet
  async deleteSingleVoucher(voucherObjectId): Promise<VoucherDocument> {
    const oid = new mongoose.Types.ObjectId(voucherObjectId);
    const result = await this.voucherModel.aggregate([
      { $unwind: '$voucherObject' },
      { $match: { 'voucherObject._id': oid } },
    ]);
    if (result[0].voucherObject.voucherPreference == 'STUDENT') {
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
  async deleteAllVoucher(restaurantId) {
    return this.voucherModel.findOneAndDelete({
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
    });
  }

  // async askForRestaurantCode(restaurantId, restaurantCode): Promise<any> {
  //   return this.restaurantService.getRestaurantUniqueCode(restaurantId);
  // }

  async verifyRestaurantCode(data): Promise<any> {
    const oid = new mongoose.Types.ObjectId(data.restaurantId);
    let isVerified: boolean;
    const res = await this.restaurantService.getRestaurantVerificationCode(
      data.restaurantId,
      data.restaurantCode,
    );
    // eslint-disable-next-line prefer-const
    isVerified = res.uniqueCode == data.restaurantCode;
    if (isVerified) {
      const verificationCode = await this.fourDigitCode(4);
      const res = await this.redeemVoucherModel.create({
        userId: data.userId,
        voucherId: data.voucherId,
        restaurantId: data.restaurantId,
        verificationCode: verificationCode,
      });
      const rPoints = await this.profileService.getSingleProfile(data.userId);
      await this.profileService.updateRewardPoints(
        data.userId,
        rPoints.rewardPoints + 1,
      );
      return res;
    } else
      throw new HttpException(
        'Please Enter Correct Restaurant Code',
        HttpStatus.NOT_ACCEPTABLE,
      );
  }

  // async redeemVoucher(
  //   userId,
  //   voucherId,
  //   restaurantId,
  //   verificationCode,
  // ): Promise<any> {
  //   const oid = new mongoose.Types.ObjectId(restaurantId);
  //   const restaurant = await this.restaurantService.getSingleRestaurantDetails(
  //     oid,
  //   );
  //   return;
  //   const user = await this.profileService.getSingleProfile(userId);
  //   // checking if user already bought subscription //
  //
  //   if (user.isPremium) {
  //     //checking if user is at the right restaurant through restaurant's verification code //
  //     if (restaurant.verificationCode == verificationCode) {
  //       const oid = new mongoose.Types.ObjectId(voucherId);
  //
  //       // fetching restaurant voucher //
  //
  //       const voucher = await this.voucherModel.findOne(
  //         {
  //           restaurantId: restaurantId,
  //         },
  //         { voucherObject: { $elemMatch: { _id: oid } } },
  //       );
  //
  //       const voucherDetails = await this.redeemVoucherModel.findOne({
  //         userId: userId,
  //         voucherId: voucherId,
  //       });
  //
  //       // checking if exactly 1 year past //
  //       if (voucherDetails) {
  //         const year = moment().diff(voucherDetails.updatedAt, 'year');
  //         if (year >= 1) {
  //           if (
  //             voucher.voucherObject[0].voucherPreference[0] ==
  //             user.accountHolderType
  //           ) {
  //             await this.redeemVoucherModel.findOneAndUpdate({
  //               userId: userId,
  //               voucherId: voucherId,
  //             });
  //             // await this.restaurantModel.findOneAndDelete(
  //             //   {
  //             //     restaurantId: restaurantId,
  //             //   },
  //             //   { verificationCode: verificationCode },
  //             // );
  //           }
  //           throw new HttpException(
  //             'Voucher Redeemed Again. Come Back Next Year!!',
  //             HttpStatus.ACCEPTED,
  //           );
  //         }
  //       }
  //       // checking if the voucher and customer type matches //
  //       if (voucher.voucherObject[0].voucherPreference[0] == 'NON-STUDENT') {
  //         const res = await this.redeemVoucherModel.findOne({
  //           userId: userId,
  //           voucherId: voucherId,
  //         });
  //
  //         // saving user details about voucher redemption in database if not already in database //
  //
  //         if (!res) {
  //           await this.redeemVoucherModel.create({
  //             userId: userId,
  //             voucherId: voucherId,
  //             restaurantId: restaurantId, //*** storing restaurantId to get popular restaurants ***//
  //           });
  //           // this.rewardPoints++;
  //           // await this.reward(userId, this.rewardPoints, this.profileModel);
  //           // if (this.rewardPoints == 10) {
  //           //   await this.profileModel.findOneAndUpdate(
  //           //     { _id: userId },
  //           //     { rewardPoints: 0 },
  //           //   );
  //           //   throw new HttpException('you get a free voucher', HttpStatus.OK);
  //           // }
  //           // else {
  //           //   await this.profileModel
  //           //     .findById({ _id: userId })
  //           //     .updateOne({ rewardPoints: this.rewardPoints });
  //           //   throw new HttpException(
  //           //     'voucher Redeemed Successfully',
  //           //     HttpStatus.OK,
  //           //   );
  //           // }
  //         }
  //         // if voucher already redeemed //
  //         else
  //           throw new HttpException(
  //             'already redeemed',
  //             HttpStatus.NOT_ACCEPTABLE,
  //           );
  //       } else
  //         throw new HttpException(
  //           'voucher type does not match',
  //           HttpStatus.NOT_ACCEPTABLE,
  //         );
  //     } else
  //       throw new HttpException(
  //         'verification code does not match',
  //         HttpStatus.FORBIDDEN,
  //       );
  //   } else
  //     throw new HttpException(
  //       'You must buy subscription to redeem the voucher',
  //       HttpStatus.FORBIDDEN,
  //     );
  // }

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
      {
        $match: {
          restaurantId: oid,
        },
      },
      {
        $count: 'total count',
      },
    ]);
  }
  async getUserWhoRedeemVoucher(voucherId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.redeemVoucherModel.find({ voucherId: oid });
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
